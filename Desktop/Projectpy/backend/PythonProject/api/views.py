from django.shortcuts import render
from  django.db import transaction
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.http import JsonResponse


from .models import all_users,Sneaker, Orders
from .serializers import all_usersSerializer,SneakerSerializer,OrdersSerializer

@api_view(['POST'])
@permission_classes([AllowAny])
def user_add(request):
    data = request.data.copy()
    if "phoneNumber" in data:
        data["phoneNumber"] = data.pop("phoneNumber")
    ser=all_usersSerializer(data=data)
    if ser.is_valid(raise_exception=True):
        ser.save()
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(ser.validated_data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    data = request.data.copy()
    username = request.data.get('username')
    mail = request.data.get('mail')
    try:
        user = all_users.objects.get(username=username,mail=mail)
        return Response({all_usersSerializer(user)}.data)
    except all_users.DoesNotExist:
        return Response({"erorr":"Неверное имя пользователя или email"})

@api_view(['GET'])
@permission_classes([AllowAny])
def user_all(request):
    ser=all_users.objects.all()
    return Response(all_usersSerializer(ser,many=True).data)

@api_view(['POST'])
def sneaker_add(request):
    data = request.data.copy()
    if "sneaker_name" in data: data["sneaker_name"] = data("sneaker_name")
    if "sneakersName" in data: data["sneakersName"] = data.pop("sneakersName")
    if "count_of_sneakers" in data: data["count_of_sneakers"] = data("count_of_sneakers")
    if "countOfSneakers" in data: data["countOfSneakers"] = data.pop("countOfSneakers")
    if "sum_sneakers" in data: data["sum_sneakers"] = data("sum_sneakers")
    if "sumSneakers" in data: data["sumSneakers"] = data.pop("sumSneakers")

    ser=SneakerSerializer(data=data)
    ser.is_valid(raise_exception=True)
    ser.save()
    return Response(ser.data, status=201)
@api_view(['GET'])
@permission_classes([AllowAny])
def orders_all(request):
    orders = Orders.objects.all()
    return Response(OrdersSerializer(orders,many=True).data)

@api_view(['POST'])
@permission_classes([AllowAny])
def order_add(request):
    client_name = request.data.get('clientName')
    sneaker_name = request.data.get('sneakerName')

    try:
        user = all_users.objects.get(username=client_name)
    except all_users.DoesNotExist:
        return Response({"erorr" : "Пользователь не найден"},status=400)
    order = Orders.objects.create(
        id_client=user.id,
        client_name=user.username,
        name_allsneakers=sneaker_name,
        status="Заказ поступил",
    )
    return Response(OrdersSerializer(order).data, status=201)


@api_view(["PUT"])
def order_update_status(request, id):
    """
    /api/orders/update-status/<id>?status=Заказ%20отправлен
    При статусах 'Заказ отправлен' или 'Завершён' уменьшаем склад на 1.
    """
    new_status = request.query_params.get("status")
    if not new_status:
        return Response({"error": "status is required"}, status=400)

    try:
        order = Orders.objects.get(pk=id)
    except Orders.DoesNotExist:
        return Response({"error": "Order not found"}, status=404)

    with transaction.atomic():
        order.status = new_status
        order.save()

        if new_status in ("Заказ отправлен", "Завершён"):
            try:
                sneaker = Sneaker.objects.get(sneakers_name=order.name_allsneakers)
                sneaker.count_of_sneakers = max(0, (sneaker.count_of_sneakers or 0) - 1)
                sneaker.save()
            except Sneaker.DoesNotExist:
                return Response({"error": "Sneaker not found"}, status=404)

    return Response(OrdersSerializer(order).data)
def health(request):
    return JsonResponse({"status": "ok"})





# Create your views here.

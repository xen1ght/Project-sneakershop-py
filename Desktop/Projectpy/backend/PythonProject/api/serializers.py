from rest_framework import serializers
from .models import all_users,Sneaker,Orders
class all_usersSerializer(serializers.ModelSerializer):
    class Meta:
        model = all_users
        fields = '__all__'

class SneakerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sneaker
        fields = '__all__'

class OrdersSerializer(serializers.ModelSerializer):
    class Meta:
        model = Orders
        fields = '__all__'
from django.urls import path
from . import views

urlpatterns = [
    # users
    path("users/add", views.user_add),
    path("users/login", views.user_login),
    path("users/all", views.user_all),

    # sneakers
    path("sneakers/add", views.sneaker_add),

    # orders
    path("orders/all", views.orders_all),
    path("orders/add", views.order_add),
    path("orders/update-status/<int:id>", views.order_update_status),
    path('health/', views.health),

]

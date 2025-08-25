# api/admin.py
from django.contrib import admin
from .models import all_users, Sneaker, Orders
admin.site.register(all_users)
admin.site.register(Sneaker)
admin.site.register(Orders)

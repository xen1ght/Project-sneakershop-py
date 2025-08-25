from django.db import models

class all_users(models.Model):

        username = models.CharField(max_length=255, null=True, blank=True)
        mail = models.CharField(max_length=255, null=True, blank=True)
        phone_number = models.CharField(max_length=255, null=True, blank=True)
        number_of_orders = models.IntegerField(default=0,null=True, blank=True)
        sum_of_orders = models.IntegerField(default=0,null=True, blank=True)

        def _str_(self):
            return self.username or f"User {self.pk}"

        class Meta:
            db_table = 'all_users'

class Sneaker(models.Model):


        sneaker_name = models.CharField(max_length=255, null=True, blank=True)
        count_of_sneakers = models.IntegerField(default=0,null=True, blank=True)
        sum_sneakers = models.IntegerField(default=0,null=True, blank=True)

        def _str_(self):
            return self.sneaker_name or f"User {self.pk}"

        class Meta:
            db_table = 'sneakers'


class Orders(models.Model):

        Status_Choises = [
            ("Заказ поступил", "Заказ поступил"),
            ("Сборка заказа", "Сборка заказа"),
            ("Заказ отправлен", "Заказ отправлен"),
            ("Завершён", "Завершён"),
        ]
        id_client = models.IntegerField()
        client_name = models.CharField(max_length=255, null=True, blank=True)
        name_allsneaker = models.CharField(max_length=255, null=True, blank=True)
        status = models.CharField(max_length=255,choices=Status_Choises, default='Заказ поступил')

        def _str_(self):
            return f"Order {self.pk} - {self.client_name}"

        class Meta:
            db_table = 'active_orders'
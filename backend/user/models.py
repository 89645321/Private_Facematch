from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    identification = models.CharField(max_length=30)
    password = models.CharField(max_length=512)
    bank = models.CharField(max_length=100, default="국민")
    account = models.CharField(max_length=100, default="123456-01-123456")
    balance = models.IntegerField(default=7647820)
    token = models.CharField(max_length=32, default="")
    token_created_at = models.IntegerField(default=0)
    token_valid = models.IntegerField(default=0)

    def __str__(self):
        return self.name

from django.db import models


class User(models.Model):
    name = models.CharField(max_length=100)
    identification = models.CharField(max_length=30)
    password = models.CharField(max_length=512)

    def __str__(self):
        return self.name

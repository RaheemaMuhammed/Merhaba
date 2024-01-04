from django.db import models
from authentication.models import CustomUser
# Create your models here.

class Profile(models):
    user=models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    chat_rooms=models.ArrayField()
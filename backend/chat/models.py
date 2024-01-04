from django.db import models
import random
import string
from django.contrib.auth import get_user_model
User = get_user_model()
# Create your models here.


class ChatRoom(models.Model):
    host = models.ForeignKey(User, on_delete=models.CASCADE)
    participants = models.ManyToManyField(User, related_name='participants',blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    room_name = models.CharField(max_length=255)
    room_code = models.CharField(max_length=50, unique=True)
    is_expired = models.BooleanField(default=False)

    def generate_unique_room_code(self,length=6):
        while True:
            code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
            if not ChatRoom.objects.filter(room_code=code).exists():
                return code

    def save(self, *args, **kwargs):
        if not self.room_code:
            self.room_code = self.generate_unique_room_code()
        super().save(*args, **kwargs)
    
    def __str__(self) -> str:
        return str(self.room_name )+'--->'+str(self.host.username)

class ChatMessage(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE)
    content = models.TextField()
    time = models.DateTimeField(auto_now_add=True)

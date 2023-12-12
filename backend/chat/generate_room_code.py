import random
import string
from .models import ChatRoom


def generate_unique_room_code(length=6):
    while True:
        code = ''.join(random.choices(string.ascii_uppercase + string.digits, k=length))
        if not ChatRoom.objects.filter(room_code=code).exists():
            return code

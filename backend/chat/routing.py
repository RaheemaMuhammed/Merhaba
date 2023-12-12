

from django.urls import path
from .consumers import *

websocket_urlpatterns = [
    path('ws/join/<str:room_code>/', JoinChatConsumer.as_asgi()),
]
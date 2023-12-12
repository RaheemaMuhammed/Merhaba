from django.urls import path
from .views import *
urlpatterns=[
    path('chatroom/',ChatRoomView.as_view()),
]
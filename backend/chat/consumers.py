from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from authentication.models import CustomUser
from .models import ChatRoom,ChatMessage
from asgiref.sync import sync_to_async
from .generate_room_code import generate_unique_room_code

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
           self.user = self.scope["user"]
           self.room_code= await generate_unique_room_code()
           self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
           self.room_group_name=f"user_{self.room_code}"
           if not self.user.is_anonymous:
               await self.channel_layer.group_add(
                   self.room_group_name,
                   self.channel_name
               )
               await self.accept()
               await self.create_room()
               await self.send_room_code(self.room_code)

        except Exception as e:
            await self.close() 
    async def disconnect(self, code):
        try:
            await self.channel_layer.group_discard(self.room_group_name, self.channel_name)
        except AttributeError:
            pass
    @database_sync_to_async
    def create_room(self):
        ChatRoom.objects.create(
            host=self.user,
            room_name=self.room_name, 
            room_code=self.room_code
        )
    
    async def send_room_code(self, room_code):
        await self.send(text_data=json.dumps({
            'room_code': room_code
        }))


class JoinChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            self.user = self.scope["user"]
            self.room_code = self.scope["url_route"]["kwargs"]["room_code"]

            chat_room= await self.add_participant()

            if chat_room is None:
                self.close()

            await self.channel_layer.group_add(
                f"user_{self.room_code}",
                self.channel_name
            )

            await self.accept()
            await self.channel_layer.group_send(
                f"user_{self.room_code}",
                {
                    'type': 'newuser',
                    'message': 'New user has joined.',
                }

            )
           
        except Exception as e:
            print(e)
            await self.close()

    @sync_to_async
    def add_participant(self):
        try:
            chat_room = ChatRoom.objects.get(room_code=self.room_code)
            if not self.user.is_anonymous:
                if self.user is not chat_room.host:
                    chat_room.participants.add(self.user)
                    chat_room.save()
            return chat_room
                 
        except ChatRoom.DoesNotExist:
                return None
    async def chatroom_deleted(self, event):
        # Notify the connected clients about chatroom deletion
        await self.send(text_data=json.dumps({
            'deleted': True,
            'message': event['message'],  # 'The chatroom has been deleted.'
        }))

    async def newuser(self, event):
        # Notify the connected clients about newuser 
        await self.send(text_data=json.dumps({
            'joined': True,
            'message': event['message'],  
        }))

    

    async def disconnect(self, code):
        try:
            await self.channel_layer.group_discard(f"user_{self.room_code}", self.channel_name)
        except AttributeError:
            pass

                

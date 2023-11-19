from channels.generic.websocket import AsyncWebsocketConsumer
import json
from asgiref.sync import async_to_sync
from channels.db import database_sync_to_async
from authentication.models import CustomUser
from .models import ChatRoom,ChatMessage
from .generate_room_code import generate_unique_room_code

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
           self.user = self.scope["user"]
           self.room_code=generate_unique_room_code()
           self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
           if not self.user.is_anonymous:
               await self.channel_layer.group_add(
                   f"user_{self.room_code}",
                   self.channel_name
               )
               await self.accept()
               await self.create_room()
               await self.send_room_code(self.room_code)

        except Exception as e:
            print(e)
            await self.close() 
    async def disconnect(self, code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    @database_sync_to_async
    def create_room(self):
        
        ChatRoom.objects.create(
            host=self.user,
            room_name=self.room_name,
            room_code=self.room_code
        )
    
    async def send_room_code(self, room_code):
        print('sending')
        await self.send(text_data=json.dumps({
            'room_code': room_code
        }))


                

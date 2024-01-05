from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from .generate_room_code import generate_unique_room_code
from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework.permissions import IsAuthenticated
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class ChatRoomView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    def post(self,request):
        try:
            data=request.data
            room_name=data['room_name']
            room_code=generate_unique_room_code()
            obj=ChatRoom.objects.create(host=request.user,room_name=room_name,room_code=room_code)
            return Response({'message':"room created successfully",'status':201,'room_code':room_code})
        except Exception as e:
            return Response({'error':str(e),'status':400})


    def get(self,request):
        try:
            code=request.GET.get('code')
            chat_room=ChatRoom.objects.get(room_code=code)
            if not chat_room.is_expired:
                serializer= ChatRoomSerializer(chat_room)
                chatroom_messages = ChatMessage.objects.filter(room__room_code=code).order_by('time')
                serializer2=ChatMessageSerializer(chatroom_messages,many=True)
                return Response({'payload':{'user_data':serializer.data,'message_data':serializer2.data},'status':200})
            return Response({'message':'This chat has been expired!!','status':404})
            
        except Exception as e:
            return Response({'error':str(e),'status':400})
        

    def delete(self,request):
        try:
            code=request.GET.get('code')
            chat_room=ChatRoom.objects.get(room_code=code)
            chat_room.is_expired=True
            chat_room.save()
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"user_{code}",
                {
                    'type': 'chatroom_deleted',
                    'message': 'This chat has been ended.',
                }
            )
            return Response({'status':200,'message':' ended successfully'})
        except Exception as e:
                 return Response({'error':str(e)})




class MessageView(APIView):
     
     authentication_classes = [JWTAuthentication]
     permission_classes = [IsAuthenticated]
     
               
     
     def post(self,request):
          try:
               data=request.data
               print(data)
               code=data['code']
               data=data.copy()
               room=ChatRoom.objects.get(room_code=code)
               data['room']=room.pk
               pk=data['sender']
               sender=CustomUser.objects.get(pk=pk)
               
               serializer=PostMessageSerializer(data=data)

               if serializer.is_valid():
                    message=serializer.save()
                    channel_layer = get_channel_layer()
                    if 'file' in request.FILES:
                        message.photo = request.FILES['file']  # Change 'photo' to your desired file field
                        message.save()
                        async_to_sync(channel_layer.group_send)(
                        f"user_{code}",
                        {
                            'type': 'new_file',
                            'file':  '/media/chat_photos/'+str(request.FILES['file']),
                            'message': data['content'],
                            'sender': {
                            'username': sender.username,
                            'pk': sender.pk,
                            'email': sender.email
                        }})
                    else:
                        async_to_sync(channel_layer.group_send)(
                            f"user_{code}",
                            {
                                'type': 'new_message',
                                'message': data['content'],
                                'sender': {
                                'username': sender.username,
                                'pk': sender.pk,
                                'email': sender.email
                            } }
                        )
            
                    return Response({'message':"message send successfully",'status':201})
               else:
                    return Response({'error':serializer.errors,'status':500})
                    
          except Exception as e:
               return Response({'error':str(e),'status':400})
               

        
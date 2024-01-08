from rest_framework.views import APIView
from rest_framework.response import Response
from .models import *
from .serializers import *
from .generate_room_code import generate_unique_room_code
from rest_framework_simplejwt.authentication import JWTAuthentication

from rest_framework.permissions import IsAuthenticated
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from dotenv import load_dotenv

load_dotenv()
import os
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
               print(serializer.is_valid())

               if serializer.is_valid():
                    message=serializer.save()
                    channel_layer = get_channel_layer()
                    if 'file' in request.FILES:
                        filename=''
                        file_type=''
                        uploaded_file = request.FILES['file']
                        file_extension = uploaded_file.name.split('.')[-1].lower()

                        if file_extension in ['jpg', 'jpeg', 'png', 'gif']:
                            # This is an image
                            message.photo = uploaded_file
                            filename=os.getenv('AWS_BASE_URL')+'chat_photos/'+str(request.FILES['file'])
                            file_type='image'
                            
                        elif file_extension in ['mp4', 'mov', 'avi']:
                            # This is a video
                            message.video = uploaded_file
                            filename=os.getenv('AWS_BASE_URL')+'chat_videos'+str(request.FILES['file'])
                            file_type='video'


                        else:
                            # This is a document
                            message.document = uploaded_file
                            filename=os.getenv('AWS_BASE_URL')+'chat_documents/'+str(request.FILES['file'])
                            file_type='document'



                        message.save()
                        async_to_sync(channel_layer.group_send)(
                        f"user_{code}",
                        {
                            'type': 'new_file',
                            'file':filename ,
                            'file_type': file_type,
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
               

        
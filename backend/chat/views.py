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
            print(room_name)
            room_code=generate_unique_room_code()
            print(room_code)
            obj=ChatRoom.objects.create(host=request.user,room_name=room_name,room_code=room_code)
            print(obj)
            return Response({'message':"room created successfully",'status':201,'room_code':room_code})
        except Exception as e:
            return Response({'error':str(e),'status':400})


    def get(self,request):
        try:
            code=request.GET.get('code')
            chat_room=ChatRoom.objects.get(room_code=code)
            serializer= ChatRoomSerializer(chat_room)
            return Response({'payload':serializer.data,'status':200})
        except Exception as e:
            return Response({'error':str(e),'status':400})
        

    def delete(self,request):
        try:
            code=request.GET.get('code')
            chat_room=ChatRoom.objects.get(room_code=code)
            chat_room.delete()
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
                f"user_{code}",
                {
                    'type': 'chatroom_deleted',
                    'message': 'The chatroom has been deleted.',
                }
            )
            return Response({'status':200,'message':' deleted successfully'})
        except Exception as e:
                 return Response({'error':str(e)})




    
from rest_framework import serializers
from .models import ChatRoom,ChatMessage
from authentication.models import CustomUser  
from dotenv import load_dotenv

load_dotenv()
import os
class UserSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()

    def get_profile_pic(self,instance):
        if instance.profile_pic:
            return os.getenv('BACKEND_URL') + 'media/'+str(instance.profile_pic)

    class Meta:
        model=CustomUser
        fields = ('pk', 'username', 'email', 'profile_pic')  

class ChatRoomSerializer(serializers.ModelSerializer):
    participants_details = UserSerializer(source='participants', many=True, read_only=True)
    host_details = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = '__all__'
        extra_fields = ['participants_details', 'host_details']

    def get_host_details(self, obj):
        # Get the host user from participants and exclude it from the participants_details
        host = obj.participants.filter(pk=obj.host.pk).first()
        if host:
            return UserSerializer(host).data
        return None

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # Remove the host details from participants_details list
        if 'participants_details' in representation and representation['host_details']:
            representation['participants_details'] = [
                participant for participant in representation['participants_details']
                if participant['pk'] != representation['host_details']['pk']
            ]
        return representation
    
class PostMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model=ChatMessage
        fields='__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    sender_details=UserSerializer(source='sender',read_only=True)
    photo = serializers.SerializerMethodField()
    video = serializers.SerializerMethodField()
    document = serializers.SerializerMethodField()
    class Meta:
        model=ChatMessage
        fields = ('id', 'sender', 'sender_details', 'room', 'content', 'time','photo','video','document')

    def get_photo(self,instance):
        if instance.photo:
            return os.getenv('BACKEND_URL') + 'media/'+str(instance.photo)
    def get_video(self,instance):
        if instance.video:
            return os.getenv('BACKEND_URL') + 'media/'+str(instance.video)
    def get_document(self,instance):
        if instance.document:
            return os.getenv('BACKEND_URL') + 'media/'+str(instance.document)

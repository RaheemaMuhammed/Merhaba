from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model=CustomUser
        fields=['username','email','password']

    def validate(self, data):
        if 'username' in data:
            for i in data['username']:
                if i.isdigit():
                    raise serializers.ValidationError({'error':'name cannot contain numbers'})
        return data
    
    def create(self, validated_data):
        print("hello")
        user=CustomUser.objects.create(email=validated_data['email'])
        user.username=validated_data['username']
        user.set_password(validated_data['password'])
        user.save()

        return user
    def update(self, instance, validated_data):
        if 'username' in validated_data:
               instance.username = validated_data.get('username', instance.username)
        if 'email' in validated_data:
               instance.email = validated_data.get('email', instance.email)
        if 'profile_pic' in validated_data:
               instance.profile_pic = validated_data.get('profile_pic', instance.profile_pic)
        instance.save()

        return instance
    

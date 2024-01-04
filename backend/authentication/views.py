from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from .emails import send_verification_link
from .token_generator_email import email_verification_token
from django.contrib.auth import authenticate,login
from rest_framework_simplejwt.tokens import RefreshToken
from .mixins import PublicApiMixin,ApiErrorsMixin
from backend.settings import BASE_FRONTEND_URL
from urllib.parse import urlencode
from rest_framework import serializers
from django.shortcuts import redirect
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .utils import google_get_access_token, google_get_user_info,generate_tokens_for_user
from .models import CustomUser
from .serializers import RegisterSerializer
from django.utils import timezone


# Create your views here.

class Register(APIView):
    def post(self,request):
        try:
            data=request.data
            serializer=RegisterSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                user=CustomUser.objects.get(email=data['email'])
                
                send_verification_link(user)
                return Response({'status':201,
                                 'message':'Successfully Registered.Please Check your email',
             
                                 'data':serializer.data})
            return Response({'status':400,
                             'message':'Error',
                             'error':serializer.errors
                             
                             })
        except Exception as e:
            return Response(
                {
                    'status': 500,
                    'message': 'An error occurred during registration.',
                    'error': str(e)
                })

class Verify(APIView):
    def post(self,request):
        try:
            data=request.data
            uidb64=data['uid']
            token=data['token']
            uid=force_str(urlsafe_base64_decode(uidb64))

            user=CustomUser.objects.get(pk=uid)
        except(TypeError,ValueError,OverflowError,CustomUser.DoesNotExist):
            user=None
        if user is not None and email_verification_token.check_token(user,token):
            user.is_active=True
            user.save()
            return Response({'message':'Email Verified','status':200})
        else:
            return Response({'message':'Something went wrong','status':400})


class Login(APIView):
    def post(self,request):
        try:
            data=request.data
            email=data['email']
            password=data['password']
            user=authenticate(email=email,password=password)
            if user is not None:
                if user.is_active == True:
                    username=user.username
                    print(username)
                    login(request,user)
                    token=RefreshToken.for_user(user)
                    print(token)
                    return Response({'message':'you are successfully logged in',
                                    'status':200,
                                    'refresh':str(token),
                                    'access':str(token.access_token),
                                    'username':username,
                                    'pk':user.pk

                    })
                else:
                    return Response({'message':'No such user found!!',
                                    'status':404
                    })
            else:
                return Response({
                    'status':401,
                    'message':'invalid email or password'
                })
        except Exception as e:
            return Response({'error':e,'status':400})

class GoogleLoginApi(PublicApiMixin, ApiErrorsMixin, APIView):
    class InputSerializer(serializers.Serializer):
        code = serializers.CharField(required=False)
        error = serializers.CharField(required=False) 

    def get(self, request, *args, **kwargs):
        
        input_serializer = self.InputSerializer(data=request.GET)
        input_serializer.is_valid(raise_exception=True)

        validated_data = input_serializer.validated_data

        code = validated_data.get('code')
        error = validated_data.get('error')

        login_url = f'{BASE_FRONTEND_URL}login'
    
        if error or not code:
            print('working')
            params = urlencode({'error': error})
            return redirect(f'{login_url}?{params}')

        redirect_uri = f'{BASE_FRONTEND_URL}'

        access_token = google_get_access_token(code=code, 
                                               redirect_uri=redirect_uri)

        user_data = google_get_user_info(access_token=access_token)

        try:
            user = CustomUser.objects.get(email=user_data['email'])
            user.last_login = timezone.now()  
            user.save()
            access_token, refresh_token = generate_tokens_for_user(user)
            response_data = {'message':'you are successfully logged in',
                        'status':200,
                'username': user.username,
                'access_token': str(access_token),
                'refresh_token': str(refresh_token),
                'pk':user.pk
            }
            return Response(response_data)
        except CustomUser.DoesNotExist:
            username = user_data['email'].split('@')[0]
            

            user = CustomUser.objects.create(
                username=username,
                email=user_data['email'],
                registration_method='google'
               
            )
            user.is_active=True
            user.last_login = timezone.now()  
            user.save()
         
            access_token, refresh_token = generate_tokens_for_user(user)
            response_data = {'message':'you are successfully logged in',
                        'status':200,
                'username': user.username,
                'access_token': str(access_token),
                'refresh_token': str(refresh_token),
                'pk':user.pk
            }
            return Response(response_data)

class ForgotPassword(APIView):
    pass



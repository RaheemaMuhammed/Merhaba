from django.utils.encoding import force_str
from django.utils.http import urlsafe_base64_decode
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from .emails import send_verification_link
from .token_generator_email import email_verification_token
from django.contrib.auth import authenticate,login
from rest_framework_simplejwt.tokens import RefreshToken

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
                    login(request,user)
                    token=RefreshToken.for_user(user)
                    return Response({'message':'you are successfully logged in',
                                    'status':200,
                                    'refresh':str(token),
                                    'access':str(token.access_token),
                                    'username':username
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



class ForgotPassword(APIView):
    pass
from django.shortcuts import render
from rest_framework.views import APIView
from .serializers import *
from rest_framework.response import Response
from .emails import send_verification_link
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
    pass

class Login(APIView):
    pass

class ForgotPassword(APIView):
    pass
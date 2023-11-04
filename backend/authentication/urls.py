from django.urls import path
from .views import *
urlpatterns=[
    path('register/',Register.as_view()),
    path('verify/',Verify.as_view()),
    path('login/',Login.as_view()),
    path('forgot_password/',ForgotPassword.as_view())
]
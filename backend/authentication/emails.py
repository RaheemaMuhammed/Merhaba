from django.core.mail import EmailMessage
from django.template.loader import render_to_string
from django.conf import settings
from .models import CustomUser
from django.utils.html import strip_tags
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from .token_generator_email import email_verification_token
from dotenv import load_dotenv

load_dotenv()
import os
def send_verification_link(user):
    # user=CustomUser.objects.get(email=email)
    FRONTEND_URL=os.getenv('FRONTEND_URL')
    # BACKEND_URL=os.getenv('BACKEND_URL')
    token = email_verification_token.make_token(user)
    # verify_link = FRONTEND_URL + '/email-verify/' + token
    subject='Account Verification'
    email_from=settings.EMAIL_HOST_USER

    body="helloo and welcome"
    body = render_to_string('email_verification.html',
            {'domain':FRONTEND_URL,
              'user': user,
                'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                'token':email_verification_token.make_token(user)
                }) 
    # text_content = strip_tags(html_content) 
    mail=EmailMessage(subject=subject,body=body,from_email=email_from,to=[user.email])
    mail.content_subtype='html'
    mail.send()

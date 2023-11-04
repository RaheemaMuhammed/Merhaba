from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.tokens import PasswordResetTokenGenerator

class EmailVerificationTokenGenerator(PasswordResetTokenGenerator):
    def _make_hash_value(self, user, timestamp: int) -> str:
        return (str(user.is_active)+str(user.pk)+str(timestamp))
    

email_verification_token=EmailVerificationTokenGenerator()
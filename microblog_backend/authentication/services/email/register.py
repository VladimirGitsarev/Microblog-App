import jwt

from time import time

from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from authentication.models import User

class RegisterEmail:

    @staticmethod
    def send_email(data, url):
        expiration_time_seconds = 3600
        token = jwt.encode({
            'username': data['username'],
            'exp': time() + expiration_time_seconds
        }, settings.EMAIL_SECRET_KEY, algorithm='HS256')

        activation_url = url + token
        subject = 'Microblog profile activation'
        html_content = f"""
                    <body>
                        <h3>Profile activation.</h3>
                        <p>Your activation link for "Microblog": 
                            <a href={activation_url}>Click here</a> to activate your profile or use the link 
                            <i>{activation_url}</i>.
                        </p>
                        <p>This link is active only for an hour. If it wasn't you, just ignore this message.</p>
                        <br />
                        <p>Best regards, <b>Microblog Team</b></p>
                    </body>
                """
        message = EmailMultiAlternatives(subject=subject, from_email=settings.EMAIL_HOST_USER, to=[data['email']])
        message.attach_alternative(html_content, 'text/html')
        message.send()

    @staticmethod
    def activate_profile(token):
        try:
            payload = jwt.decode(token, settings.EMAIL_SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(username=payload.get('username'))
            user.is_active = True
            user.save()
            return 'User profile successfully activated'
        except jwt.exceptions.ExpiredSignatureError:
            return 'This link is no longer available'
        print(payload)

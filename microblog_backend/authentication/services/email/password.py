from time import time

import jwt

from django.core.mail import EmailMultiAlternatives
from django.conf import settings


class PasswordEmail:

    @staticmethod
    def send_email(user, url):
        expiration_time_seconds = 3600
        token = jwt.encode({'user_id': user.id, 'exp': time() + expiration_time_seconds}, settings.EMAIL_SECRET_KEY, algorithm='HS256')
        reset_url = url + token
        subject = 'Microblog password reset'
        html_content = f"""
            <body>
                <h3>Password reset.</h3>
                <p>Password reset has been requested. 
                    <a href={reset_url}>Click here</a> to reset your password or use the link <i>{reset_url}</i>.
                </p>
                <p>This link is active only for an hour. If it wasn't you, just ignore this message.</p>
                <br />
                <p>Best regards, <b>Microblog Team</b></p>
            </body>
        """
        message = EmailMultiAlternatives(subject=subject, from_email=settings.EMAIL_HOST_USER, to=[user.email])
        message.attach_alternative(html_content, 'text/html')
        message.send()

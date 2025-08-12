# This file is for managing email-related functionality 
from django.core.mail import BadHeaderError, send_mail, EmailMessage
from django.http import HttpResponse, HttpResponseRedirect
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

# Function to send a registration email to the user passed in argument
def send_registration_email(user):
    context = {'user': user} # passing the argument used in the html file
    html_message = render_to_string('emails/signup_email.html', context)
    plain_message = strip_tags(html_message)
    # Send the email
    subject = 'Bienvenue à Gazostheque'
    from_email = settings.EMAIL_HOST_USER
    to_email = user['email']
    send_mail(subject, plain_message, from_email, [to_email], html_message=html_message)
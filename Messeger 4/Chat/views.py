from django.shortcuts import render,HttpResponse,loader
import json
from django.core.files.storage import default_storage
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework import permissions
from django.http import JsonResponse
from rest_framework_simplejwt.tokens import RefreshToken
from .models import BlacklistableToken
from django.shortcuts import redirect
from django.contrib.auth import logout
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.throttling import UserRateThrottle
from django.views.decorators.csrf import csrf_exempt,ensure_csrf_cookie, csrf_protect
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
#from AuthApp.excel_py.form1s import ReadWithFullRange
from circuitbreaker import circuit
from django.utils.html import escape
from django.contrib.auth.models import BaseUserManager
from django.core import mail
from django.shortcuts import render
from .models import GroupChat
from .models import sanitize_string
def send_data_file_to_email(file_path, to, message):
    fromEmail = 'machariabrian712@gmail.com'
    title = 'DAIMAC-Intel'
    toEmail = to
    
    with open(file_path,'rb') as f:
        attached_file = f.read()
    with mail.get_connection() as connection:
        mail.EmailMessage(
        title,
        message,
        fromEmail,
        [toEmail],
        connection=connection,
        attachments=[('AcademicYear.xlsm',attached_file)]
        ).send()

def filter(data):  #for  though dosent work avoiding XML attacks    
    soup = escape(data)    
    return soup

class Datathrottler(UserRateThrottle):
    scope = 'DataThrottler'

class fileUploadthrottler(UserRateThrottle):
    scope = 'fileUpload'

class csrfTokenThrottler(UserRateThrottle):
    scope = 'csrf'

# Create your views here.
@method_decorator(csrf_exempt, name='dispatch')
class Test (APIView):
    permission_classes = (AllowAny,)
    throttle_classes = [Datathrottler]

    def post(self,request):
        val =  list(GroupChat.objects.all().values())   
        return Response(str(val),status=200)

@method_decorator(csrf_exempt,name='dispatch')
class LogoutView(APIView):
     permission_classes = (IsAuthenticated,)
     throttle_classes = [csrfTokenThrottler]

     def post(self, request):
          
          try:
            refresh_token = request.data["refresh_token"]
            #token = BlacklistableToken.objects.get(key=refresh_token)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
          except Exception as e:
            
            return Response(status=status.HTTP_400_BAD_REQUEST)




def index(request):

    
    return render(request, 'indexChat.html')

    #@method_decorator(csrf_exempt,name='dispatch')

@method_decorator(csrf_exempt,name='dispatch')
class FileUploadView(APIView):
    permission_classes = (AllowAny,)
    throttle_classes = [fileUploadthrottler]
    @circuit
    def post(self, request):        

        data = request.data
        file_name = sanitize_string(data['name'])
        file_buffer = data['file']
        if default_storage.exists(file_name):
            pass
            # Duplicate found, handle it (e.g., raise an error, rename the file)
        else:
            with default_storage.open(file_name, 'wb') as f:
                file_data = file_buffer.read()
                f.write(file_data)
        return Response( status=status.HTTP_200_OK)
       



from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend
#
from django.contrib.auth.hashers import check_password
from datetime import datetime
from django.contrib.auth import logout
from django.http import HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import View
from django.views.decorators.csrf import ensure_csrf_cookie, csrf_protect
from django.contrib import auth
from djoser.serializers import PasswordResetConfirmSerializer
from rest_framework import serializers


class CustomAuthBackend(BaseBackend):
    def authenticate(self, request,email=None, password=None, **kwargs):
        UserModel = get_user_model()
        try:
            user = UserModel.objects.get(email=email)
            if user.check_password(password):
                return user
        except UserModel.DoesNotExist:
            return None

        

        return None

    def get_user(self, user_id):
        UserModel = get_user_model()
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None

class CustomLogoutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        return HttpResponseRedirect(reverse_lazy('login'))





class SetHeaderMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        
        response = self.get_response(request)
        request.META.pop('X-Powered-By', None)
        request.META.pop('Server', None)
        
        #response = self.get_response(request)
        csp_directives = {            
            "frame-ancestors": 'none',
    
        }

        csp_header_value = '; '.join([f"{directive} {value}" for directive, value in csp_directives.items()])
        response['Content-Security-Policy'] = csp_header_value

        response['X-Content-Type-Options'] = 'nosniff'
        response['X-Frame-Options'] = 'deny'
        return response   
from django.contrib import admin
from django import forms
from .models import Account,AccountManager,GroupChat,PersonalChats,CommunityChat,RequestTable,GroupChatUsersList
from .models import AiPageCarousels,OnlineStatus
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User
from django.contrib.auth import logout
from django.shortcuts import redirect
from django.contrib import admin
from django.contrib.auth.models import Group
from datetime import datetime
from django.core.management.base import BaseCommand
from django.utils import timezone
admin.site.site_title = 'login admin'
admin.site.site_header = 'LOGIN'
admin.site.site_index = 'Welcome Back'
from django.contrib.admin import site
import time, asyncio, json,os,datetime
from django.urls import reverse
from django.http import HttpResponseRedirect
from django.contrib import messages
from django.conf import settings
from pathlib import Path
import shutil

from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
BASE_DIR = Path(__file__).resolve().parent.parent


class OutstandingTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'created_at','expires_at')
    search_fields = ('user__email', 'user__username')
    list_filter = ('created_at',)

class BlacklistedTokenAdmin(admin.ModelAdmin):
    list_display = ('user', 'token', 'blacklist_date','blacklist_at')
    search_fields = ('user__email', 'user__username', 'token')
    list_filter = ('blacklist_date',)

ActiveUser = Account.objects.all()
class UserAccountAdmin (admin.ModelAdmin):
    
    list_display=('name','email','is_staff')
    exclude=['JobsHistory,rattings','requestedJobs']
    list_filter=['is_staff','is_active','is_superuser']

    def get_actions(self, request):
        actions = super().get_actions(request)
        if 'delete_selected' in actions:
            del actions['delete_selected']
        return actions
    
    def get_readonly_fields(self, request, obj=None):
        readonly_fields = super().get_readonly_fields(request, obj)
        if obj and obj.email == "daimac@gmail.com":
            # Make all fields read-only for the user with email "daimac@gmail.com"
            return [field.name for field in self.model._meta.fields]
        return readonly_fields

    

    def response_add(self, request, obj, post_url_continue=None):
        # Get the created primary key of the user
        user_pk = str(obj.pk)
        userid = str(obj.id)
       
        detail = {
                obj.email : {
                    'name' : obj.name,
                    'about' : obj.about,
                    'id' : userid,
                    'ProfilePic' : f'http://127.0.0.1:8000{obj.ProfilePic.url}'
                }
            }
        now = datetime.datetime.now()
        short_date = now.strftime("%Y-%m-%d")   
           
        PersonalChats.objects.create(group_name = user_pk,RecieverId = '',SenderId = userid,Details = detail,DateCreated = str(short_date),name = obj.name,email = obj.email)
        #creating a folder for each user as they are registered
        folder_name = str(obj.email)
        folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)

        # Create the folder
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
           
        # Call the parent's response_add method to continue with the default behavior
        
        return super().response_add(request, obj, post_url_continue)

    def save_model(self, request, obj, form, change):
        is_new = not Account.objects.filter(pk=obj.pk).exists()
        # print('Called save_model: is_new =', is_new)
        if is_new:  # If this is a new object
            
            obj.set_password(form.cleaned_data['password'])
           
            super().save_model(request, obj, form, change)
    
    def delete_model(self, request, obj):
        if obj.email == "daimac@gmail.com" or obj.email == 'kenjicladia@gmail.com' or obj.email == 'gestuser@gmail.com':
            # Prevent deletion of the user with email "daimac@gmail.com"
            message = "You are not allowed to delete the Sole Administrator."
            self.message_user(request, message, level='ERROR')
            return False
        else:
            #removing entire user content details stored in the server
            folder_name = str(obj.email)
            folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
            # Create the folder
            if os.path.exists(folder_path):
                shutil.rmtree(folder_path)
            super().delete_model(request, obj)
        
    def response_delete(self, request, obj_display, obj_id):
        opts = self.model._meta
        pk_value = obj_id
        preserved_filters = self.get_preserved_filters(request)

        if obj_display:
            deleted_objects = [obj_display]
        else:
            deleted_objects = [self.model._meta.verbose_name]

        if request.POST.get('_delete_confirmation') != '1':
            return HttpResponseRedirect(request.path)

        self.message_user(request, 'Successfully deleted %s.' % ' '.join(deleted_objects), messages.SUCCESS)
        # Instead of showing the success message, return to the change list
        return HttpResponseRedirect(reverse('admin:%s_%s_changelist' % (opts.app_label, opts.model_name)) + '?' + preserved_filters)


    def get_fieldsets(self, request, obj=None):
        fieldsets = super().get_fieldsets(request, obj)
        if not obj:
            New_fieldsets = (
                (None, {
                'fields': ('email', 'name','password','is_active', 'is_staff','is_superuser')
            }),
            ('Profile',{
                'fields' : ('ProfilePic','about')
            })
            ,)
        else:
            New_fieldsets = (
                (None, {
                'fields': ('email', 'name','is_active', 'is_staff','is_superuser')
            }),
            ('Profile',{
                'fields' : ('ProfilePic','about')
            })
            ,)
        return New_fieldsets 
    
    readonly_fields=('id',)
    
class GrouplistAdmin(admin.ModelAdmin):
    exclude=['UsersList','ChatLogs','account_email']
    readonly_fields = ['Creator','DateCreated','group_name']
    list_display= ('title',)   
    def save_model(self, request, obj, form, change):
        email = request.user.email
        name = request.user.name
        accountref = Account.objects.get(email = email)
        
        if not obj.pk:  # If this is a new object
            now = datetime.datetime.now()
            short_date = now.strftime("%Y-%m-%d")  
            #obj.UsersList = [email]
            obj.account_email = accountref
            obj.Creator = email
            obj.DateCreated = str(short_date)
            
            val = f'{request.user.email}Groups{obj.pk}'
            NewMessegerFolder = os.path.join(settings.MEDIA_ROOT,val)
            if not os.path.exists(NewMessegerFolder):
                os.makedirs(NewMessegerFolder)
        super().save_model(request, obj, form, change) 
        
        exists = GroupChatUsersList.objects.filter(name = name,email = email,group_ref = obj).exists()
        if not exists:
            GroupChatUsersList.objects.create(name = name,email = email,group_ref = obj)

    def delete_model(self, request, obj):
        #removing entire user content details stored in the server
        folder_name = f'{request.user.email}Groups{obj.pk}'        
        folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
        # Create the folder
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)
        super().delete_model(request, obj)

class CommunitylistAdmin(admin.ModelAdmin):
    exclude=['DateCreated','ChatLogs','account_email','group_name']
    readonly_fields = ['Creator']
    list_display= ('title','DateCreated')  
    def save_model(self, request, obj, form, change):
        email = request.user.email
        accountref = Account.objects.get(email = email)
        if not obj.pk:  # If this is a new object
            now = datetime.datetime.now()
            short_date = now.strftime("%Y-%m-%d")  
            obj.Creator = email
            obj.account_email = accountref
            obj.DateCreated = str(short_date)  
            super().save_model(request, obj, form, change)
    def delete_model(self, request, obj):
        #removing entire user content details stored in the server
        folder_name = f'{request.user.email}Community{obj.pk}'        
        folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
        # Create the folder
        if os.path.exists(folder_path):
            shutil.rmtree(folder_path)
        super().delete_model(request, obj)

class PersonalChatsAdmin(admin.ModelAdmin):
    exclude=['Details','ChatLogs']
    readonly_fields= ['RecieverId','SenderId','encryptionKey']
    list_display= ('group_name','SenderId','RecieverId')    

class GroupChatUsersListAdmin(admin.ModelAdmin):
    readonly_fields= ['group_ref','name','email']


class AiPageCarouselsAdmin(admin.ModelAdmin):
    list_display = ('title',)
    search_fields = ('title',)

class OnlineStatusAdmin(admin.ModelAdmin):
    pass

admin.site.unregister(Group)
admin.site.register(Account, UserAccountAdmin)
admin.site.register(GroupChat,GrouplistAdmin)
admin.site.register(RequestTable)
admin.site.register(CommunityChat,CommunitylistAdmin)
admin.site.register(PersonalChats,PersonalChatsAdmin)
admin.site.register(AiPageCarousels,AiPageCarouselsAdmin)
admin.site.register(OnlineStatus,OnlineStatusAdmin)
admin.site.register(GroupChatUsersList,GroupChatUsersListAdmin)


from django.db import models
from django.shortcuts import get_list_or_404
from django.db.models import Prefetch
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager,Group,Permission
from django.contrib.auth.models import Permission
from django.contrib.contenttypes.models import ContentType
from rest_framework.authtoken.models import Token
from django.utils.html import escape, strip_tags
import re,json,os
from django.contrib.postgres.fields import JSONField
from django.core.validators import EmailValidator, RegexValidator
from django.core.exceptions import ValidationError
#for making a multiple select field in the admin panel site
#from multiselectfield import MultiSelectField
from channels.db import database_sync_to_async
import uuid,datetime
from django.core.exceptions import ValidationError

from django.conf import settings
from django.contrib.postgres.fields import ArrayField
def alphanumeric_validator(value): #for the name and text to  be validated and avoid attacks
    #regex = re.compile(r'^[a-zA-Z0-9]*$')
    regex = re.compile(r'^[a-zA-Z0-9.,\'\s]*$')
    if not regex.match(value):
        raise ValidationError('Only alphanumeric characters are allowed.')

def json_validator(value): #for the name and text to  be validated and avoid attacks
    try:
        data = json.loads(value)
        if not isinstance(data, list):
            raise ValidationError('ChatLog must be a list')
        for item in data:
            if not isinstance(item, dict):
                raise ValidationError('Each item in ChatLog must be a dictionary')
    except json.JSONDecodeError:
        raise ValidationError('Invalid JSON')


def sanitize_string(input_string):
    # Escape any HTML tags
    escaped_string = escape(input_string)

    # Remove all HTML tags
    sanitized_string = strip_tags(escaped_string)

    return sanitized_string

def generate_unique_id():
    return str(uuid.uuid4())[:16]  # Generates a unique ID with the first 8 characters of a UUID

def generate_e2e_id():
    return str(uuid.uuid4())[:32]  # Generates a unique ID with the first 8 characters of a UUID


class AccountManager(BaseUserManager):
   
    def create_user(self,email,name, password=None):
        if not email:
            raise ValueError("User must have an email address")
             
        
            
        email = self.normalize_email(email)
        name = sanitize_string(name)
        SanitizedName = sanitize_string(name)
        user = self.model(email=email, name=SanitizedName)        
        user.set_password(str(password))
        user.is_active = True 
        print(user.id)
        user.save(using=self._db)
        user_pk = str(user.id)
        #print('recreating user details: ', user_pk)
        detail = {
                email : {
                    'name' : name,
                    'about' : 'Hey there am new to this applicaiton.',
                    'id' : user_pk,
                    'ProfilePic' : 'http://127.0.0.1:8000/media/images/fallback.jpeg'
                }
            }
        now = datetime.datetime.now()
        short_date = now.strftime("%Y-%m-%d")   
        PersonalChats.objects.create(group_name = user_pk,RecieverId = '',SenderId = user_pk,Details = detail,DateCreated = str(short_date),name = name,email = email)
        #print('done')
        #creating a folder for each user as they are registered
        folder_name = str(email)
        folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)

        # Create the folder
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        return user

    def create_superuser(self,email, name,password=None):
        if not email:
            raise ValueError("User must have an email address")
        
        email = self.normalize_email(email)
        SanitizeName = sanitize_string(name)
        user = self.create_user( email=email, name=SanitizeName)        
        user.set_password(str(password))
        user.is_superuser = True
        user.is_staff = True
        user.is_active = True
        detail = {
                email : {
                    'name' : user.name,
                    'about' : user.about,
                    'id' : str(user.id)
                }
            }
        
        # assigning permission to the user
        content_types = ContentType.objects.all()
        for permission in Permission.objects.filter(content_type__in=content_types):
            user.user_permissions.add(permission)
        user.save(using=self._db)
        return user 


__all__ = ['Account']

class Account(AbstractBaseUser,PermissionsMixin):

    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    email = models.EmailField(max_length=40, validators=[EmailValidator()], unique=True,db_index=True)
    name = models.CharField(max_length=30, validators=[alphanumeric_validator])
    is_active = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    ProfilePic = models.ImageField(upload_to='images/',default='/images/fallback.jpeg',verbose_name='Profile Picture', blank=True )
    ProfileCoverPhoto = models.ImageField(upload_to='images/',default='/images/fallback.jpeg',verbose_name='Profile Cover photo', blank=True )
    about = models.CharField(verbose_name='About',validators=[alphanumeric_validator], blank=True, null=True,max_length=80)
    ProfileAbout = models.JSONField(blank=True,null=True)
    
    ProfileRepository = models.JSONField(blank=True,null=True)
    ProfilePhotos = models.JSONField(blank=True,null=True)
    ProfileVideos = models.JSONField(blank=True,null=True)
    groups = models.ManyToManyField(
        Group,
        related_name='useraccount_set',  # Custom related_name
        blank=True,
        help_text='The groups this user belongs to.',
        verbose_name='groups',
    )
    
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='useraccount_set',  # Custom related_name
        blank=True,
        help_text='Specific permissions for this user.',
        verbose_name='user permissions',
    )
    
    
    def get_full_name(self):
        return self.name
    
    def get_short_name(self):
        return self.name
    
    def __str__(self):
        return f'{self.name} ※ {self.email}'
    objects = AccountManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']
# this is for creating a balcklist method

class AccountFollowers (models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    followedAt = models.CharField(max_length=30,blank=True,null=True)
    followed_id = models.ForeignKey( 
        Account,  # Refers to the custom user model (Account)
        to_field='id',          # Specifies that the foreign key references the id field
        on_delete=models.CASCADE,  # Deletes post when the related Account is deleted
        related_name='followed',       # Optional: Allows reverse lookup from Account to Post
        db_index=True,
    )
    follower_id = models.ForeignKey( 
        Account,  # Refers to the custom user model (Account)
        to_field='id',          # Specifies that the foreign key references the id field
        on_delete=models.CASCADE,  # Deletes post when the related Account is deleted
        related_name='follower',       # Optional: Allows reverse lookup from Account to Post
        db_index=True,
    )
    is_mutual = models.BooleanField(default=False)
    class Meta:
        # Add a unique constraint on this fields together
        unique_together = ('follower_id', 'followed_id')

class BlacklistableToken(Token):
    def blacklist(self):
        self.is_active = False
        self.save()


class GroupChat(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    group_name = models.CharField(
        db_index=True,
        verbose_name='Group Id',
        max_length=5000,
        validators=[alphanumeric_validator],
        unique=True,
        default=generate_unique_id  # Generate a short, unique ID using UUID
    )
    title = models.CharField(verbose_name='Name',null=True,max_length=50,validators=[alphanumeric_validator],db_index=True)
    #ProfilePic = models.ImageField(verbose_name='Profile Picture')
    DateCreated = models.CharField(verbose_name='Date Created',blank=True,null=True)
    description = models.CharField(max_length=100,verbose_name='Description',null=True)
    ProfilePic = models.ImageField(upload_to='images/',default='fallback.jpeg',verbose_name='Profile Picture', blank=True )
    about = models.CharField(verbose_name='About',validators=[alphanumeric_validator], blank=True, null=True,max_length=100)
    ChatLogs =  models.JSONField(blank=True,null=True)
    account_email = models.ForeignKey(
        Account,  # Refers to the custom user model (Account)
        to_field='email',          # Specifies that the foreign key references the email field
        on_delete=models.CASCADE,  # Deletes post when the related Account is deleted
        related_name='Groups',       # Optional: Allows reverse lookup from Account to Post
        blank=True,
        null=True
    )
    Creator = models.EmailField(blank=True,null=True,db_index=True)
    def get_full_name(self):
        return self.title
    
    def get_short_name(self):
        return self.title
    
    def __str__(self):

        return f'{self.title}'

class GroupChatUsersList(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    name = models.CharField(max_length=30, validators=[alphanumeric_validator])
    email = models.EmailField(max_length=40, validators=[EmailValidator()],db_index=True)
    group_ref = models.ForeignKey(
        GroupChat,  
        on_delete=models.CASCADE, 
        to_field= 'group_name',
        related_name='UsersList',
        blank=True,
        null=True
    )
    class Meta:
        # Add a unique constraint on 'group_ref' and 'email' together
        unique_together = ('group_ref', 'email')
    def get_full_name(self):
        return self.email
    
    def get_short_name(self):
        return self.email
    
    def __str__(self):

        return f'{self.email}--{self.name}--{self.group_ref}'

class RequestTable(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    UserId = models.CharField(blank=False,null=False,db_index=True,unique=False)
    RoomName = models.CharField(blank=False,null=False,db_index=True,unique=False)
    groupname = models.CharField(blank=True,null=True)
    UserDetails = models.JSONField()
    status = models.CharField(default='False')
    dateRequested = models.CharField(max_length=30,blank=True,null=True)
    Creator = models.EmailField(db_index=True,validators=[EmailValidator],blank=False,null=False,default='kenjicladia@gmail.com')
    account_email = models.ForeignKey(
        Account,  # Refers to the custom user model (Account)
        to_field='email',          # Specifies that the foreign key references the email field
        on_delete=models.CASCADE,  # Deletes post when the related Account is deleted
        related_name='requestTable',       # Optional: Allows reverse lookup from Account to Post
        blank=True,
        null=True    
    )
 
class CommunityChat(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    group_name = models.CharField(
        db_index=True,
        verbose_name='community Id',
        max_length=5000,
        validators=[alphanumeric_validator],
        unique=True,
        default=generate_unique_id  # Generate a short, unique ID using UUID
    )
    title = models.CharField(verbose_name='Name',null=True,max_length=50,validators=[alphanumeric_validator],db_index=True)
    #ProfilePic = models.ImageField(verbose_name='Profile Picture')
    DateCreated = models.CharField(verbose_name='Date Created',blank=True,null=True)
    description = models.CharField(max_length=100,verbose_name='Description',null=True)
    ProfilePic = models.ImageField(upload_to='images/',default='fallback.jpeg',verbose_name='Profile Picture', blank=True )
    about = models.CharField(verbose_name='About',validators=[alphanumeric_validator], blank=True, null=True,max_length=100)
    ChatLogs =  models.JSONField(blank=True,null=True)
    account_email = models.ForeignKey(
        Account,  # Refers to the custom user model (Account)
        to_field='email',          # Specifies that the foreign key references the email field
        on_delete=models.CASCADE,  # Deletes post when the related Account is deleted
        related_name='community',       # Optional: Allows reverse lookup from Account to Post
        blank=True,
        null=True
    )
    Creator = models.EmailField(blank=True,null=True,db_index=True)  
    
      
    def get_full_name(self):
        return self.group_name
    
    def get_short_name(self):
        return self.group_name
    
    def __str__(self):
        return f'{self.group_name}, {self.title}'
    
class PersonalChats(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    group_name = models.CharField(db_index=True,verbose_name='Group Id',max_length=50,validators=[alphanumeric_validator],unique=True)
    SenderId = models.CharField(null=True,max_length=50,validators=[alphanumeric_validator])
    RecieverId = models.CharField(null=True,blank=True,max_length=50,validators=[alphanumeric_validator])
    DateCreated = models.CharField(verbose_name='Date Created',blank=True,null=True)
    encryptionKey = models.CharField(
        verbose_name='End to End encryption key',
        max_length=5000,
        validators=[alphanumeric_validator],
        unique=True,
        default=generate_e2e_id  # Generate a 32, unique ID using UUID
    )
    Details = models.JSONField(blank=True,null=True)
    ChatLog =  models.JSONField(blank=True,null=True)   
    email = models.EmailField(max_length=40, validators=[EmailValidator()],db_index=True,null=True,blank=True)
    name = models.CharField(max_length=30, validators=[alphanumeric_validator],null=True,blank=True)
    def get_full_name(self):
        return self.group_name
    
    def get_short_name(self):
        return self.group_name
    
    def __str__(self):
        return f'{self.group_name},{self.SenderId} - {self.RecieverId} '
    
class NotePad(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    email = models.EmailField(db_index=True,max_length=50,validators=[EmailValidator],blank=True,null=True)
    DateCreated = models.CharField(blank=True,null=True)
    LastText = models.TextField(blank=True,null=True,default='last text')
    NoteLog =  models.JSONField(blank=True,null=True)   
    title = models.TextField(blank=True,null=True,unique=True)
    account_email = models.ForeignKey(
            Account,  # Refers to the custom user model (Account)
            to_field='email',          # Specifies that the foreign key references the email field
            on_delete=models.CASCADE,  # Deletes post when the related Account is deleted
            related_name='notepad',       # Optional: Allows reverse lookup from Account to Post
            blank=True,
            null=True
        )


class OnlineStatus(models.Model):
    online = models.JSONField(null=True,blank=True)
    lastSeen = models.JSONField(null=True,blank=True)

#post table 
class Post(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    title = models.CharField(blank=True,null=True,max_length=100,validators=[alphanumeric_validator])
    content = models.TextField(blank=True,null=True)
    datePosted = models.CharField(max_length=30)
    totalShares = models.TextField(blank=True,null=True)
    # Foreign key to Account model using the email field
    account_email = models.ForeignKey(
        Account,  # Refers to the custom user model (Account)
        to_field='email',          # Specifies that the foreign key references the email field
        on_delete=models.CASCADE,  # Deletes post when the related Account is deleted
        related_name='posts'       # Optional: Allows reverse lookup from Account to Post
    )
    postUserDetails = models.JSONField(blank=True,null=True) #contains: profilePic,name
    postPrivacy = models.CharField(blank=True,null=True,max_length=30, validators=[alphanumeric_validator]) #either: public or private
    likes = models.JSONField(blank=True,null=True) # contains only emials in array

    def __str__(self):
        return self.title
    
#post comment table 
class PostComment(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    message = models.TextField(blank=True,null=True, validators=[alphanumeric_validator])
    # Foreign key to Post model using the id field
    post_id = models.ForeignKey(
        Post,  # Refers to the custom user model (Account)
        on_delete=models.CASCADE,  # Deletes comment when the related post is deleted
        related_name='comments'       # Optional: Allows reverse lookup from Account to Post
    )
    # Foreign key to Account model using the email field
    account_email = models.ForeignKey(
        Account,  # Refers to the custom user model (Account)
        to_field='email',          # Specifies that the foreign key references the email field
        on_delete=models.CASCADE,  # Deletes comment when the related Account is deleted
        related_name='comments'    # Allows reverse lookup from Account to PostComment
    )
    CommentUserDetails = models.JSONField(blank=True,null=True) #contains: profilePic,name
    dateCommented = models.CharField(blank=True,null=True,max_length=30) # contains only emials in array
    replyCommentDetails = models.JSONField(blank=True,null=True)

class SavedPost(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    # Foreign key to Post model using the id field
    post = models.ForeignKey(
        Post,  # Refers to the custom user model (Account)
        on_delete=models.CASCADE,  # Deletes comment when the related post is deleted
        related_name='savedpost'       # Optional: Allows reverse lookup from Account to Post
    )
    # Foreign key to Account model using the email field
    account_email = models.ForeignKey(
        Account,  # Refers to the custom user model (Account)
        to_field='email',          # Specifies that the foreign key references the email field
        on_delete=models.CASCADE,  # Deletes comment when the related Account is deleted
        related_name='savedpost'    # Allows reverse lookup from Account to PostComment
    )
    class Meta:
        unique_together = ('post', 'account_email')
   
class FolderTable(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    title = models.CharField(blank=True,null=True,max_length=100,validators=[alphanumeric_validator])
    dateCreated = models.CharField(max_length=60,blank=True,null=True)
    account_email = models.ForeignKey(
        Account,  # Refers to the custom user model (Account)
        to_field='email',          # Specifies that the foreign key references the email field
        on_delete=models.CASCADE,  # Deletes post when the related Account is deleted
        related_name='folders'       # Optional: Allows reverse lookup from Account to Post
    )

class FileTable(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    name = models.CharField(blank=True,null=True,max_length=100,validators=[alphanumeric_validator])
    dateCreated = models.CharField(max_length=60,blank=True,null=True)
    size = models.CharField(max_length=60,blank=True,null=True)
    fileUrl = models.TextField( validators=[alphanumeric_validator],blank=True,null=True)
    type = models.TextField( validators=[alphanumeric_validator],blank=True,null=True)
    # Foreign key to Post model using the id field
    folder_id = models.ForeignKey(
        FolderTable,  # Refers to the custom user model (Account)
        on_delete=models.CASCADE,  # Deletes comment when the related post is deleted
        related_name='files'       # Optional: Allows reverse lookup from Account to Post
    )
    # Foreign key to Account model using the email field
    account_email = models.ForeignKey(
        Account,  # Refers to the custom user model (Account)
        to_field='email',          # Specifies that the foreign key references the email field
        on_delete=models.CASCADE,  # Deletes comment when the related Account is deleted
        related_name='files'    # Allows reverse lookup from Account to PostComment
    )

class AiPageCarousels(models.Model):
    id = models.CharField(
        primary_key=True,
        default=uuid.uuid4,  # Use the custom generator
        editable=False,
    )
    title = models.CharField(blank=False,null=False,max_length=100,validators=[alphanumeric_validator],db_index=True)
    info = models.CharField(max_length=1024,blank=False,null=False)
    img = models.ImageField(upload_to='ai/carousels/',default='/AI.webp',verbose_name='Image', blank=True )

    def get_full_name(self):
        return self.title
    
    def get_short_name(self):
        return self.title
    
    def __str__(self):

        return f'{self.title}'

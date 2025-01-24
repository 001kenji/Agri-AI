from djoser.serializers import UserCreateSerializer, ActivationSerializer
from django.contrib.auth import get_user_model

from rest_framework import serializers
from .models import AccountManager,Post,PostComment,SavedPost,FolderTable,FileTable,PersonalChats,GroupChatUsersList
from .models import GroupChat,CommunityChat,RequestTable,AccountFollowers,AiPageCarousels
User = get_user_model()
import datetime

from django.contrib.auth.password_validation import MinimumLengthValidator

class UserCreateSerializer(UserCreateSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta (UserCreateSerializer.Meta):
        model = User
        fields = (
            'id','email',
            'is_active',
            'name','password',            
            )

    
class UserSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    #including an extra external field
    # 
    class Meta:
        model = User
        
        fields = ( 
            'name','email','id','ProfilePic','about')


class PostSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = Post
        fields = ['id','title', 'content', 'datePosted','totalShares', 'account_email', 'postUserDetails', 'postPrivacy', 'likes']

class AccountFollowersSerializer(serializers.ModelSerializer):
    # #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = AccountFollowers
        fields = ['status','followedAt','is_mutual']

class FollowersListsSerializer(serializers.ModelSerializer):
    # #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = AccountFollowers
        fields = ['follower_id']
        
    def to_representation(self, instance):
        # Return only the follower_id instead of a dictionary
        return instance.follower_id_id
    


class FollowersDetailsListsSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = AccountFollowers
        fields = ['id','follower_id']

    def to_representation(self, instance):
        # Access the related Account model via `follower_id`
        follower_account = instance.follower_id
        return {
            "userID": follower_account.id,
            "name": follower_account.name,
            'ProfilePic' : follower_account.ProfilePic.url if follower_account.ProfilePic else None,
            'followedDate' : instance.followedAt,
            'position' : instance.id
        }

class FollowingDetailsListsSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = AccountFollowers
        fields = ['id','followed_id']

    def to_representation(self, instance):
        # Access the related Account model via `followed_id`
        follower_account = instance.followed_id
        return {
            "userID": follower_account.id,
            "name": follower_account.name,
            'ProfilePic' : follower_account.ProfilePic.url if follower_account.ProfilePic else None,
            'followedDate' : instance.followedAt,
            'position' : instance.id
        }

class PostCommentSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = PostComment
        fields = ['id','message', 'post_id','account_email', 'CommentUserDetails','dateCommented', 'replyCommentDetails']


class SavedPostSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    post = PostSerializer()  # Use PostSerializer to serialize the related Post data

    class Meta:
        model = SavedPost
        fields = ['post']
        
    def to_representation(self, instance):
        # Extract only the serialized Post data, removing the 'post' key wrapper
        representation = super().to_representation(instance)
        return representation['post']
    

class FolderTableSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = FolderTable
        fields = ['id','title','dateCreated']


class FileTableSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = FileTable
        fields = ['id','name','dateCreated','size','fileUrl','type']


class PersonalChatsSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = PersonalChats
        fields = ['group_name','SenderId','RecieverId','DateCreated','Details','id','encryptionKey']



class GroupChatUsersListSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = GroupChatUsersList
        fields = ['name','email']  # Specify fields you want to include
    def to_representation(self, instance):
        # Override to return a list of names only
        return instance.email

class GroupChatSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    UsersList = serializers.SerializerMethodField()
    class Meta:
        model = GroupChat
        fields = ['id','group_name','title','DateCreated','Creator','description','ProfilePic','about','UsersList']

    def get_UsersList(self, obj):
        # Return a list of names from related GroupChatUsersList
        return [user.email for user in obj.UsersList.all()]


class CommunityChatSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = CommunityChat
        fields =['id','group_name','title','DateCreated','description','ProfilePic','about','Creator']

class RequestTableSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = RequestTable
        fields =['id','UserId','RoomName','groupname','UserDetails','status','dateRequested','Creator']

class AiPageCarouselsSerializer(serializers.ModelSerializer):
    #id = serializers.UUIDField(format='hex')  # Converts UUID to a string
    class Meta:
        model = AiPageCarousels 
        fields =['img','info','title']

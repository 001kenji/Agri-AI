from django.shortcuts import render,HttpResponse,loader
import json,os,datetime
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
from django.db.models import Q
from circuitbreaker import circuit
from django.utils.html import escape
from django.contrib.auth.models import BaseUserManager
from django.core import mail
from django.conf import settings
from django.core.files.storage import FileSystemStorage
from django.db.models import Prefetch
from django.shortcuts import render
from .models import GroupChat,Account,Post,PostComment,FileTable,FolderTable,CommunityChat,AccountFollowers,GroupChatUsersList
from .serializers import PostSerializer,FileTableSerializer,GroupChatSerializer,FollowersDetailsListsSerializer,FollowersListsSerializer,CommunityChatSerializer
from .models import sanitize_string
from .profile import ProfileAbout,get_posts_by_email
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


@method_decorator(csrf_exempt,name='dispatch')
class ProfileView(APIView):
     permission_classes = (AllowAny,)
     throttle_classes = [csrfTokenThrottler]

     def post(self, request):
          
          try:
            #print('reading')           
            data = request.data[0]
    
            Scope = data['scope']
            if Scope == 'Overview':
                emailval = request.data[1]  
                result = ProfileAbout(props=Scope,email=emailval,Profiledata=data)
                profile = list(Account.objects.filter(email= emailval).values('ProfileAbout','ProfileCoverPhoto'))
                return Response([result,profile],status=200)
            elif Scope == 'Contact':
                emailval = request.data[1]  
                result = ProfileAbout(props=Scope,email=emailval,Profiledata=data)
                profile = list(Account.objects.filter(email= emailval).values('ProfileAbout','ProfileCoverPhoto'))
                return Response([result,profile],status=200)
            elif Scope == 'ReadProfile' : 
                emailval = sanitize_string(data['AccountEmail'])
                idval = sanitize_string(data['AccountID'])
                IsFollowing = False
                IsOwner = sanitize_string(data['IsOwner'])
                followers = 0
                following = 0
                accountref = Account.objects.get(id = idval)
                if IsOwner == 'True':
                    profile = list(Account.objects.filter(email= emailval).values('id','name','email','ProfilePic','ProfileAbout','ProfileCoverPhoto'))
                    #followersQueryset = AccountFollowers.objects.filter(followed_id=accountref)
                    xval = AccountFollowers.objects.filter(followed_id=accountref)
                    serializedval = FollowersListsSerializer(xval,many = True)
                    followers = serializedval.data
                    following = AccountFollowers.objects.filter(~Q(followed_id=accountref) & Q(follower_id = accountref)).count()

                else:
                    UserID = sanitize_string(data['UserID'])
                    profile = list(Account.objects.filter(id= idval).values('id','name','email','ProfilePic','ProfileAbout','ProfileCoverPhoto'))
                    account_followed = Account.objects.get(id = idval)
                    xval = AccountFollowers.objects.filter(followed_id=account_followed)
                    serializedval = FollowersListsSerializer(xval,many = True)
                    followers = serializedval.data
                    following = AccountFollowers.objects.filter(~Q(followed_id=account_followed) & Q(follower_id = accountref)).count()
                    if emailval != "gestuser@gmail.com":
                        if int(UserID) in followers:
                            IsFollowing = True
                        else:
                            IsFollowing = False
                    else:
                        IsFollowing = False
                    
                profilePost = get_posts_by_email(email=emailval,id = idval)
                #serializedData = PostSerializer(profilePost, many=True)
                profile.append({'ProfilePost' : profilePost})
                accountbody = {
                    'IsOwner' : IsOwner,
                    'followers' : len(followers),
                    'following' : following,
                    'IsFollowing' : IsFollowing
                }
                profile.append({'accountDetails' : accountbody})
                # profile.append({'followers' : followers})
                # profile.append({'following' : following})
               
                x = {'scope': 'ReadProfile'}
                profile.insert(0,x)
                return Response(profile,status=200)
            elif Scope == 'UsernameUpdate':
               
                emailval = request.data[1] 
                nameval = sanitize_string(data['Username'])
                x = Account.objects.filter(email = emailval)
                x.update(name = nameval)
                Account.save
                responseval = {'success' : 'Saved'}
                return Response(responseval,status=200)
            elif Scope == 'ReadProfilePost':
                emailval = sanitize_string(data['AccountEmail'])
                idval = sanitize_string(data['AccountID'])
                profile = []
                profilePost = get_posts_by_email(email=emailval,id = idval)
                #serializedData = PostSerializer(profilePost, many=True)
                profile.append(profilePost)
                #print(profile)
                x = {'scope': 'ReadProfilePost'}
                profile.insert(0,x)
                return Response(profile,status=200)
            elif Scope == 'DeletePost':
                idval = sanitize_string(data['PostId'])
                folder_name = str(data['AccountEmail'])
                userID = sanitize_string(data['AccountID'])
                emailval = sanitize_string(data['AccountEmail'])
                postToDelete = list(Post.objects.filter(id = idval).values('postUserDetails'))
                fileToDelete = postToDelete[0]['postUserDetails']['PostFileUrl']
                filenameposition = fileToDelete.split('Post/', 1)
                filename = filenameposition[1]
                print('url is -----------::', fileToDelete)
                folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
                #print('folder path: ',folder_path)
                if os.path.exists(folder_path):
                    #print('saving file beggins .......')
                    Post_file_path = os.path.join(settings.MEDIA_ROOT,folder_name,'Post',filename)
                    os.remove(Post_file_path)
                    #print('filename: ',Post_file_path)
                Post.objects.filter(id = idval).delete()
                profilePost = get_posts_by_email(email=emailval,id = userID)
                #serializedData = PostSerializer(profilePost, many=True)
                responseval = [{'scope' : 'DeletePost','result' : 'Post deleted successfuly','posts' : profilePost}]
                return Response(responseval,status=200)
            elif Scope == 'MakePostPublic':
                idval = sanitize_string(data['PostId'])
                userID = sanitize_string(data['AccountID'])
                emailval = sanitize_string(data['AccountEmail'])
                x = Post.objects.filter(id = idval)
                x.update(postPrivacy = 'public')
                profilePost = get_posts_by_email(email=emailval,id = userID)
                #serializedData = PostSerializer(profilePost, many=True)
                responseval = [{'scope' : 'MakePostPublic','result' : 'Post updated successfuly','posts' : profilePost}]
                return Response(responseval,status=200)
            elif Scope == 'FollowAccount':
                emailval = sanitize_string(data['UserEmail'])
                AccountID = sanitize_string(data['AccountID'])
                IsOwner = sanitize_string(data['IsOwner'])
                UserID = sanitize_string(data['UserID'])
                action = sanitize_string(data['action'])
                followers = []
                following = []
                IsFollowing = False
                userExists = Account.objects.filter(email = emailval).exists()
                if userExists == False:
                    responseval = {'failed' : 'Sign up to manage accounts'}
                    return Response(responseval,status=status.HTTP_400_BAD_REQUEST)
                
                accountref = Account.objects.get(email = emailval)
                AlienAccount = Account.objects.get(id = AccountID)
                if action == 'follow':
                    now = datetime.datetime.now()
                    short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
                    try:
                        AccountFollowers.objects.create(
                        followed_id = AlienAccount,
                        follower_id = accountref,
                        followedAt = str(short_date),
                        )
                    except Exception as e:
                        responseval = {'failed' : 'Account already followed'}
                        return Response(responseval,status=status.HTTP_400_BAD_REQUEST)
                    IsFollowing = True
                    xval = AccountFollowers.objects.filter(followed_id=AlienAccount).count()
                    following = AccountFollowers.objects.filter(~Q(followed_id=AlienAccount) & Q(follower_id = AlienAccount)).count()
                    #serializedval = FollowersListsSerializer(xval,many = True)
                    followers = xval #serializedval.data
                elif action == 'unfollow':
                    AccountFollowers.objects.filter(followed_id = AlienAccount,follower_id = accountref).delete()
                    IsFollowing = False
                    xval = AccountFollowers.objects.filter(followed_id=AlienAccount).count()
                    #serializedval = FollowersListsSerializer(xval,many = True)
                    followers = xval #serializedval.data
                    following = AccountFollowers.objects.filter(~Q(followed_id=AlienAccount) & Q(follower_id = AlienAccount)).count()
                
                followersval = AccountFollowers.objects.filter(Q(followed_id=AlienAccount) & ~Q(follower_id = AlienAccount)).order_by('id')[:50]
                serializedfollowersval = FollowersDetailsListsSerializer(followersval,many = True)
                followerslist = serializedfollowersval.data
                accountbody = {
                    'IsOwner' : IsOwner,
                    'followers' : followers,
                    'following' : following,
                    'IsFollowing' : IsFollowing,
                    'followerslist' : followerslist,
                    'scope': 'FollowAccount'
                }
                return Response(accountbody,status=200)
          except Exception as e:
            print(e)
            responseval = {'failed' : 'The data you requested cannot be found at the moment.'}
            return Response(responseval,status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_exempt,name='dispatch')
class UploadProfileDocs(APIView):
    permission_classes = (IsAuthenticated,)
    throttle_classes = [fileUploadthrottler]
    @circuit
    def post(self, request):        
        try:
            data = request.data
            scope = data['scope']
            if scope == 'CoverPhotoUpdate':
                emailval = sanitize_string(data['email'])
                file_name = sanitize_string(data['name'])
                storage_name = f'/{emailval}/{file_name}'
                file_buffer = data['CoverPhoto']              
                
                folder_name = str(emailval)
                folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
                #print('folder path: ',folder_path)
                if os.path.exists(folder_path):
                    #print('saving beggins .......')
                    custom_storage = FileSystemStorage(location=folder_path)
                    with custom_storage.open(file_name, 'wb') as f:
                        file_data = file_buffer.read()
                        f.write(file_data)
                        
                    #print('saving ends..........')
                x = Account.objects.filter(email = emailval)
                x.update(ProfileCoverPhoto=storage_name)
                Account.save
                return Response( status=status.HTTP_200_OK)
            elif scope == 'ProfilePictureUpdate':
                emailval = sanitize_string(data['email'])
                file_name = sanitize_string(data['name'])
                storage_name = f'/{emailval}/{file_name}'
                file_buffer = data['ProfilePicture']               
                
                folder_name = str(emailval)
                folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
                #print('folder path: ',folder_path)
                if os.path.exists(folder_path):
                    #print('saving beggins .......')
                    custom_storage = FileSystemStorage(location=folder_path)
                    with custom_storage.open(file_name, 'wb') as f:
                        file_data = file_buffer.read()
                        f.write(file_data)
                        
                    #print('saving ends..........')
                x = Account.objects.filter(email = emailval)
                x.update(ProfilePic=storage_name)
                Account.save
                return Response( status=status.HTTP_200_OK)
            elif scope == 'UploadPost':
                emailval = sanitize_string(data['email'])
                file_name = sanitize_string(data['PostFileName'])
                PostDetails = json.loads(data['PostDetails'])
                userID = sanitize_string(data['AccountID'])
                storage_name = f'/{emailval}/Post/{file_name}'
                file_buffer = data['PostFile']             
                folder_name = str(emailval)
                folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
                #print(file_buffer)
                UserExists = Account.objects.filter(email=emailval).exists()
                if os.path.exists(folder_path) and UserExists == True:
                    if file_buffer != 'null' and file_buffer != None:
                        #print('saving file beggins .......')
                        Post_folder_path = os.path.join(settings.MEDIA_ROOT,folder_name,'Post')
                        if not os.path.exists(Post_folder_path):
                            os.makedirs(Post_folder_path)                    
                        custom_storage = FileSystemStorage(location=Post_folder_path)
                        with custom_storage.open(file_name, 'wb') as f:
                            file_data = file_buffer.read()
                            f.write(file_data)
                    #saving the post in db
                    #print('done saving file')
                    now = datetime.datetime.now()
                    short_date = now.strftime("%Y-%m-%dT%H:%M:%S")  
                    #print(1,PostDetails)
                    postUserDetailsval = {
                        'name' : PostDetails['UserName'],
                        'profilePic' : PostDetails['ProfilePic'],
                        'PostFileType' : PostDetails['PostFileType'],
                        'PostFileUrl' : storage_name,
                        'userID' : userID
                    } 
                    #print(2,postUserDetailsval)
                    UserAccount = Account.objects.get(email=emailval)
                    Post.objects.create(
                        title= PostDetails['title'],
                        content=PostDetails['PostContent'],
                        datePosted=str(short_date),
                        account_email=UserAccount,
                        postUserDetails=postUserDetailsval,
                        postPrivacy=PostDetails['postPrivacy']
                        )
                #print(3)
                    
                    profilePost = get_posts_by_email(email=emailval,id = userID)
                    serializedData = PostSerializer(profilePost, many=True)
                    #print(4,serializedData.data)
                    #print('saving post in databse ends..........')
                    responseval = {'success':'post uploaded successfuly','Scope' : 'PostUpload','PostData' : profilePost}
                    return Response( responseval,status=status.HTTP_200_OK)
                else:
                    responseval = {'failed' : 'Invalid account. Sign up to manage account'}
                    return Response(responseval,status=status.HTTP_400_BAD_REQUEST)
            elif scope == 'UploadRepositoryFile':
                emailval = sanitize_string(data['email'])
                file_name = sanitize_string(data['name'])
                filesize = sanitize_string(data['size'])
                folderId = sanitize_string(data['folderId'])
                fileType = sanitize_string(data['fileType'])
                storage_name = f'/{emailval}/repository/{file_name}'
                file_buffer = data['file']             
                folder_name = str(emailval)
                folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
                #print('folder path: ',folder_path)
                if os.path.exists(folder_path):
                    #print('saving file beggins .......')
                    Post_folder_path = os.path.join(settings.MEDIA_ROOT,folder_name,'repository')
                    if not os.path.exists(Post_folder_path):
                        os.makedirs(Post_folder_path)
                    custom_storage = FileSystemStorage(location=Post_folder_path)
                    with custom_storage.open(file_name, 'wb') as f:
                        file_data = file_buffer.read()
                        f.write(file_data)
                    #saving the post in db
                    #print('done saving file')
                    now = datetime.datetime.now()
                    short_date = now.strftime("%d-%m-%Y")  
                    #print(2,postUserDetailsval)
                    UserAccount = Account.objects.get(email=emailval)
                    folderRef = FolderTable.objects.get(id = folderId,account_email = UserAccount)
                    FileTable.objects.create(
                        name= file_name,
                        dateCreated=str(short_date),
                        account_email=UserAccount,
                        folder_id = folderRef,
                        type = fileType,
                        size=filesize,
                        fileUrl=storage_name
                        )
                    #print(3)
                    fileData = folderRef.files.all().order_by('id')
                    file_list = FileTableSerializer(fileData,many=True)
                    responseval = {'success':'File uploaded successfuly','Scope' : 'UploadRepositoryFile','FileList' : file_list.data}
                    return Response( responseval,status=status.HTTP_200_OK)
                else:
                    responseval = {'failed' : 'Invalid account, Sign up to manage chats'}
                    return Response(responseval,status=status.HTTP_400_BAD_REQUEST)
            elif scope == 'UploadChatFile':
                emailval = sanitize_string(data['email'])
                file_name = sanitize_string(data['name'])
                InboxType = sanitize_string(data['InboxType'])
                inboxRef = sanitize_string(data['inboxRef'])
                inboxRefId = sanitize_string(data['inboxRefId'])
                folder_name = str(emailval)
                if InboxType == 'Chats':
                    Post_folder_path = os.path.join(settings.MEDIA_ROOT,folder_name,'chats',inboxRef)              
                else:
                    val = f'{inboxRef}{InboxType}{inboxRefId}' # eg kenjicladia@gmail.comGroups1212
                    Post_folder_path = os.path.join(settings.MEDIA_ROOT,val)
                                 
                file_buffer = data['file']             
                
                isAccount = Account.objects.filter(email = emailval).exists()
                if not isAccount:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
                #print('folder path: ',folder_path)
                if os.path.exists(folder_path):
                    #print('saving file beggins .......')
                    
                    if not os.path.exists(Post_folder_path):
                        os.makedirs(Post_folder_path)
                    custom_storage = FileSystemStorage(location=Post_folder_path)
                    with custom_storage.open(file_name, 'wb') as f:
                        file_data = file_buffer.read()
                        f.write(file_data)
                    #print('\n Done')
                    return Response(status=status.HTTP_200_OK)
                else:
                    responseval = {'failed' : 'Invalid account, Sign up to manage chats'}
                    return Response(responseval,status=status.HTTP_400_BAD_REQUEST)
            elif scope == 'CreateNewMesseger':
                dataval = json.loads(data['data'])
                useremail = sanitize_string(dataval['email'])
                messegerName = sanitize_string(dataval['name'])
                username = sanitize_string(dataval['username'])
                messegerScope = sanitize_string(dataval['scope'])
                messegerabout = sanitize_string(dataval['about'])
                messegerdescription = sanitize_string(dataval['description'])
                profilePicName = sanitize_string(dataval['profilePicName'])
                folder_name = str(useremail)
                folder_path = os.path.join(settings.MEDIA_ROOT, folder_name)
                                 
                file_buffer = data['file']             
                file_buffer2 = data['file']  
                isAccount = Account.objects.filter(email = useremail).exists()
                if not isAccount:
                    return Response({'status' : 'error','result' : 'Invalid account. Sign up to manage messeger'},status=status.HTTP_400_BAD_REQUEST)
                accountRef = Account.objects.get(email = useremail)
                now = datetime.datetime.now()
                short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
                #print('folder path: ',folder_path)
                if messegerScope == 'Groups':
                      
                    newRow = GroupChat.objects.create(
                        title = messegerName,
                        DateCreated = str(short_date),
                        ProfilePic = f"/{folder_name}/{profilePicName}",
                        description = messegerdescription,
                        about = messegerabout,
                        account_email = accountRef,
                        Creator = useremail
                    )
                    val = f'{useremail}{messegerScope}{newRow.id}' # eg kenjicladia@gmail.comCommunity1212
                    newRow.ProfilePic = f"/{val}/{profilePicName}"
                    newRow.save()
                    GroupChatUsersList.objects.create(name = username,email = useremail,group_ref = newRow)
                    scopeCustomName = 'Group'
                    val = f'{useremail}{messegerScope}{newRow.id}' # eg kenjicladia@gmail.comGroups1212
                    NewMessegerFolder = os.path.join(settings.MEDIA_ROOT,val)     
                    #fetching groups list with relation to the user
                    user_groups = GroupChatUsersList.objects.filter(email=useremail)
                    group_chats = [user_group.group_ref for user_group in user_groups]
                    MessegerList = GroupChatSerializer(group_chats,many=True)         
                elif messegerScope == 'Community':
                    newRow = CommunityChat.objects.create(
                        title = messegerName,
                        DateCreated = str(short_date),
                        ProfilePic = f"/{folder_name}/{profilePicName}",
                        description = messegerdescription,
                        about = messegerabout,
                        account_email = accountRef,
                        Creator = useremail
                    )
                    scopeCustomName = 'Community'
                    val = f'{useremail}{messegerScope}{newRow.id}' # eg kenjicladia@gmail.comCommunity1212
                    newRow.ProfilePic = f"/{val}/{profilePicName}"
                    newRow.save()
                    NewMessegerFolder = os.path.join(settings.MEDIA_ROOT,val)
                    #fetching communities
                    val = CommunityChat.objects.all()
                    MessegerList = CommunityChatSerializer(val,many=True)
                
                if os.path.exists(folder_path):
                    if not os.path.exists(NewMessegerFolder):
                        os.makedirs(NewMessegerFolder)
                    custom_storage = FileSystemStorage(location=NewMessegerFolder)
                    with custom_storage.open(profilePicName, 'wb') as f:
                        file_data = file_buffer2.read()
                        f.write(file_data)
                else:
                    responseval = {'failed' : 'Invalid account, Sign up to manage chats'}
                    return Response(responseval,status=status.HTTP_400_BAD_REQUEST) 
                

                responseval = {'status' : 'success','result':f'{scopeCustomName} created successfuly','Scope' : 'CreateNewMesseger','MessegerScope' : {messegerScope},'list' : MessegerList.data}
                return Response( responseval,status=status.HTTP_200_OK)
                    
        except Exception as e:
            print(e)
            responseval = {'failed' : 'Error occured when processing your request'}
            return Response(responseval,status=status.HTTP_400_BAD_REQUEST)


def index(request):

    
    return render(request, 'indexChat.html')

    #@method_decorator(csrf_exempt,name='dispatch')

@method_decorator(csrf_exempt,name='dispatch')
class FileUploadView(APIView):
    permission_classes = (IsAuthenticated,)
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
       

@method_decorator(csrf_exempt, name='dispatch')
class PostHtmlView(APIView):
    permission_classes = (AllowAny,)
    throttle_classes = [csrfTokenThrottler]

    def get(self, request, post_id, *args, **kwargs):
        # Access post_id from the URL
        post_idval = sanitize_string(post_id)
        val = Post.objects.filter(id = post_idval).first()
        serializeddata = PostSerializer(val,many=False)
        postData = serializeddata.data

        print(postData)
        return render(request,'post.html',postData)

    

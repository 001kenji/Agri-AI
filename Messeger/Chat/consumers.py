# chat/consumers.py
import json,threading,datetime,aiohttp
from django.core.files.storage import FileSystemStorage
import time,os,shutil, asyncio,base64
from django.conf import settings, Settings
from markdown import markdown
from asgiref.sync import sync_to_async,async_to_sync
from channels.generic.websocket import WebsocketConsumer,AsyncWebsocketConsumer
from django.core.exceptions import ValidationError
from .models import Account,GroupChat,PersonalChats,OnlineStatus,CommunityChat,GroupChatUsersList,RequestTable,NotePad
from channels.db import database_sync_to_async
from django.core.files.storage import default_storage
from django.db.models import Q
from .models import sanitize_string,Post,PostComment,AiPageCarousels,SavedPost,FolderTable,FileTable,AccountFollowers
from circuitbreaker import circuit
from .serializers import PostSerializer,PostCommentSerializer,PersonalChatsSerializer,SavedPostSerializer,FolderTableSerializer,FileTableSerializer
from .serializers import GroupChatSerializer,AiPageCarouselsSerializer,CommunityChatSerializer,RequestTableSerializer,FollowersDetailsListsSerializer,FollowingDetailsListsSerializer,FollowersListsSerializer
import google.generativeai as genai
from django.conf import settings
from asyncio import Task, gather, CancelledError
#from ..Messeger.settings import redisConnection

@circuit
@database_sync_to_async
def GroupListFunc(emailval):       
    try:
        user_groups = GroupChatUsersList.objects.filter(email=emailval)
        group_chats = [user_group.group_ref for user_group in user_groups]
        serializedgroup = GroupChatSerializer(group_chats,many=True)
        
        # val = GroupChat.objects.all()
        # responseval = GroupChatSerializer(val,many=True)
        return serializedgroup.data
    except Exception as e:
        print(e)
        reponseval = {'status' : 'error','messege' : 'invalid data'}
        return reponseval


@circuit
@database_sync_to_async
def CommunityListFunc(SearchUserval,IsContinue = False,ContinuetionId = False):       
        # val =  list(CommunityChat.objects.all().values())      
        # return val
    #print(ContinuetionId,IsContinue,SearchUserval,type(SearchUserval))
    try:
        if IsContinue == 'True':
            if SearchUserval != 'False' and SearchUserval != 'None':
                val = CommunityChat.objects.filter(Q(title__icontains = SearchUserval) & Q(id__gt=ContinuetionId))[:20]  
            else:
                val = CommunityChat.objects.filter(Q(id__gt=ContinuetionId))[:20]  
            responseval = CommunityChatSerializer(val,many=True)
            dataval = {'IsContinue' : IsContinue,'data' : responseval.data,'status' : 'success'}
        else:
            if SearchUserval != 'False' and SearchUserval != 'None':
                val = CommunityChat.objects.filter(Q(title__icontains = SearchUserval))[:20]  
            else:
                val = CommunityChat.objects.all()[:10]  
            responseval = CommunityChatSerializer(val,many=True)
            dataval = {'IsContinue' : IsContinue,'data' : responseval.data,'status' : 'success'}
        return dataval
    except Exception as e:
        #print(e)
        reponseval = {'status' : 'error','messege' : 'invalid data'}
        return reponseval


@circuit
@database_sync_to_async
def ChatLogsFunc(RecieverId,SenderId):   
    MessegeList = []
    try:
        if(SenderId != 'null' and RecieverId != 'null'):
            personal =  PersonalChats.objects.all().filter( Q(SenderId = SenderId,RecieverId = RecieverId) | Q(RecieverId = SenderId,SenderId = RecieverId) )
            personalval = PersonalChatsSerializer(personal,many=True)
            val = list(personal.values())
            if(len(val) != 0):
                chat = val[0]['ChatLog']
                if(chat != None):
                    MessegeList = chat[-20:]
                else:                    
                    MessegeList = []
            else:
                MessegeList = []
            
            return {'status' : 'success','InboxDetails' : personalval.data,'MessegeList' : MessegeList}
        else:
            return {'status' : 'error'}
    except Exception as e:
        return {'status' : 'error'}


@circuit
@database_sync_to_async
def GroupLogsFunc(props):       
    try:
        if props != None:
            groups =  GroupChat.objects.all().filter(group_name = props)
            groupsval = GroupChatSerializer(groups,many=True)
            val = list(groups.values())
            if(len(val) != 0):
                chat = val[0]['ChatLogs']
                if(chat != None):
                    MessegeList = chat[-20:]
                else:                    
                    MessegeList = []
            else:
                MessegeList = []
            
            return {'status' : 'success','scope' : 'Groups','InboxDetails' : groupsval.data,'MessegeList' : MessegeList}
        else:
            return {'status' : 'error'}
    except Exception as e:
        return {'status' : 'error'}

@circuit
@database_sync_to_async
def CommunityLogsFunc(props):     
    try:    
        if props != None:
            community =  CommunityChat.objects.all().filter(group_name = props) 
            communityval = CommunityChatSerializer(community,many=True)
            val = list(community.values())
            if(len(val) != 0):
                chat = val[0]['ChatLogs']
                if(chat != None):
                    MessegeList = chat[-20:]
                else:                    
                    MessegeList = []
            else:
                MessegeList = []
            
            return {'status' : 'success','scope' : 'Community','InboxDetails' : communityval.data,'MessegeList' : MessegeList}
        else:
            return {'status' : 'error'}
    except Exception as e:
        return {'status' : 'error'}
@circuit
@database_sync_to_async
def ChatListFunc(RecieverId):       
    try:
        val = PersonalChats.objects.filter( (Q(SenderId = RecieverId) | Q(RecieverId = RecieverId)) & (~Q(SenderId='') & ~Q(RecieverId=''))  )
        responseval = PersonalChatsSerializer(val,many=True)
        return responseval.data
    except Exception as e:
        #print(e)
        reponseval = {'status' : 'error','messege' : 'invalid data'}
        return reponseval


@circuit
@database_sync_to_async
def GroupChatLogGroup(ReplyChat,inboxId,TopMessegeId,ReplyChatName,Groupname,name,message,email,src,upload,delId,action=None):
    try:
        now = datetime.datetime.now()
        short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
        data =  list(GroupChat.objects.all().values().filter(group_name = Groupname))
        if(data[0]):
            chat = data[0]['ChatLogs']
            if(chat != None):
                if action != None and action == 'delete from all':
                    for i, d in enumerate(chat):
                        if str(d['id']) == str(delId):
                            if d['src'] != '' and d['src'] != 'null':
                                file_path = str(d['src'])
                                pathval = file_path.lstrip('/')
                                folder_path = os.path.join(settings.MEDIA_ROOT, pathval)
                                # delete file
                                if os.path.exists(folder_path):
                                    os.remove(folder_path)
                            dateval = d['time']
                            #x = chat[i]['DelList'] if chat[i]['DelList'] else [] 
                            chat[i] = {
                                "name" : name,
                                "text" : 'This message was deleted!',
                                "time" : dateval,
                                "email" :email,
                                "Status" : 'deleted',
                                "src" : '',
                                'upload' : '',
                                'action' : 'deleted from all',
                                'DelList' : [0],
                                'ReplyChatName' : '',
                                'ReplyChat' : '',
                                'id' : delId
                            }
                            break
                elif action !=None and action == 'delete from me':
                    for i, d in enumerate(chat):
                        if str(d['id']) == str(delId):
                            x = chat[i]['DelList'] 
                            msgemail = d['email']
                            msgval  = d['text']
                            msgname = d['name']
                            x.append(email)          
                            ReplyChatval = chat[i]['ReplyChat'] if chat[i]['ReplyChat'] else '' 
                            srcval = chat[i]['src']  
                            uploadval = chat[i]['upload'] 
                            dateval = d['time']
                            chat[i] = {
                                "name" : msgname,
                                "text" : msgval,
                                "time" : dateval,
                                "email" :  msgemail,
                                "Status" : 'deleted',
                                "src" : srcval,
                                'upload' : uploadval,
                                'action' : 'deleted from me',
                                'DelList' : x,
                                'ReplyChatName' : ReplyChatval,
                                'ReplyChat' : ReplyChatval,
                                'id' : delId
                            }
                            break
                else:
                    chatlistLength = len(chat)
                    if src != '' and src != 'null':
                        val = f'{email}Groups{inboxId}'
                        srcval = f'{val}/{src}'
                    else:
                        srcval = ''
                    chat.append({
                        "name" : name,
                        "text" : message,
                        "time" : str(short_date),
                        "email" :email,
                        "Status" : 'send',
                        "src" : srcval,
                        'upload' : upload,
                        'action' : '',
                        'DelList' : [0],
                        'ReplyChatName' : ReplyChatName,
                        'ReplyChat' : ReplyChat,
                        'id' : chatlistLength + 1
                    })
            else:
                if src != '' and src != 'null':
                    val = f'{email}Groups{inboxId}'
                    srcval = f'{val}/{src}'
                chat = [{
                    "name" : name,
                    "text" : message,
                    "time" : str(short_date),
                    "email" :email,
                    "Status" : 'send',
                    "src" : src,
                    'upload' : upload,
                    'action' : '',
                    'DelList' : [0],
                    'ReplyChatName' : '',
                    'ReplyChat' : '',
                    'id' : 0
                }]
            x = GroupChat.objects.all().values().filter(group_name = Groupname)
            x.update(ChatLogs = chat)

            GroupChat.save 
            StartIndex = TopMessegeId if TopMessegeId != None else 0
            MessegeList = chat[int(StartIndex):]
            return  MessegeList #chat
        else:
            return ''
    except Exception as e:
        return ''

@circuit
@database_sync_to_async
def CommunityChatLogGroup(ReplyChat,inboxId,TopMessegeId,ReplyChatName,Groupname,name,message,email,src,delId,upload,action=None):
    try:
        now = datetime.datetime.now()
        short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
        data =  list(CommunityChat.objects.all().values().filter(group_name = Groupname))
        if(data[0]):
            chat = data[0]['ChatLogs']
            if(chat != None):
                if action != None and action == 'delete from all':
                    for i, d in enumerate(chat):
                        
                        if str(d['id']) == str(delId):
                            
                            if d['src'] != '' and d['src'] != 'null':
                                file_path = str(d['src'])
                                pathval = file_path.lstrip('/')
                                folder_path = os.path.join(settings.MEDIA_ROOT, pathval)
                                # delete file
                                if os.path.exists(folder_path):
                                    os.remove(folder_path)
                            dateval = d['time']
                            #x = chat[i]['DelList'] if chat[i]['DelList'] else [] 
                            chat[i] = {
                                "name" : name,
                                "text" : 'This message was deleted!',
                                "time" : dateval,
                                "email" :email,
                                "Status" : 'deleted',
                                "src" : '',
                                'upload' : '',
                                'action' : 'deleted from all',
                                'DelList' : [0],
                                'ReplyChatName' : '',
                                'ReplyChat' : '',
                                'id' : delId
                            }
                            break
                elif action !=None and action == 'delete from me':
                    for i, d in enumerate(chat):
                        if str(d['id']) == str(delId):
                            x = chat[i]['DelList'] 
                            msgemail = d['email']
                            msgval  = d['text']
                            msgname = d['name']
                            x.append(email)                        
                            ReplyChatval = chat[i]['ReplyChat'] if chat[i]['ReplyChat'] else '' 
                            srcval = chat[i]['src'] 
                            uploadval = chat[i]['upload']
                            dateval = d['time']
                            chat[i] = {
                                "name" : msgname,
                                "text" : msgval,
                                "time" : dateval,
                                "email" :  msgemail,
                                "Status" : 'deleted',
                                "src" : srcval,
                                'upload' : uploadval,
                                'action' : 'deleted from me',
                                'DelList' : x,
                                'ReplyChatName' : ReplyChatval,
                                'ReplyChat' : ReplyChatval,
                                'id' : delId
                            }
                            break
                else:
                    chatlistLength = len(chat)
                    if src != '' and src != 'null':
                        val = f'{email}Community{inboxId}'
                        srcval = f'{val}/{src}'
                    else:
                        srcval = ''
                    chat.append({
                        "name" : name,
                        "text" : message,
                        "time" : str(short_date),
                        "email" :email,
                        "Status" : 'send',
                        "src" : srcval,
                        'upload' : upload,
                        'action' : '',
                        'DelList' : [0],
                        'ReplyChatName' : ReplyChatName,
                        'ReplyChat' : ReplyChat,
                        'id' : chatlistLength + 1
                    })
            else:
                if src != '' and src != 'null':
                    val = f'{email}Community{inboxId}'
                    srcval = f'{val}/{src}'
                chat = [{
                    "name" : name,
                    "text" : message,
                    "time" : str(short_date),
                    "email" :email,
                    "Status" : 'send',
                    "src" : src,
                    'upload' : upload,
                    'action' : '',
                    'DelList' : [0],
                    'ReplyChatName' : '',
                    'ReplyChat' : '',
                    'id' : 0
                }]
            x = CommunityChat.objects.all().values().filter(group_name = Groupname)
            x.update(ChatLogs = chat)

            CommunityChat.save 
            StartIndex = TopMessegeId if TopMessegeId != None else 0
            #print('getting: ',StartIndex,TopMessegeId,len(chat))
            MessegeList = chat[int(StartIndex):]
            #print('return: ',MessegeList)
            return  MessegeList #chat
        else:
            return ''
    except Exception as e:
        return ''

@circuit
@database_sync_to_async
def PrivateChatLog(ReplyChatName,inboxEmail,TopMessegeId,ReplyChat,Groupname,email,name,RecieverId,SenderId,message,src,upload,action=None,delId = None):
    try:
        now = datetime.datetime.now()
        short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
        data =  list(PersonalChats.objects.all().values().filter(RecieverId = RecieverId,SenderId = SenderId))
        
        if(data[0]):
            chat = data[0]['ChatLog']
            if(chat != None):
                if action != None and action == 'delete from all':
                    for i, d in enumerate(chat):
                        
                        if str(d['id']) == str(delId):
                            #deleting file if it exists in the deleted chat
                            if d['src'] != '' and d['src'] != 'null':
                                file_path = str(d['src'])
                                pathval = file_path.lstrip('/')
                                folder_path = os.path.join(settings.MEDIA_ROOT, pathval)
                                # delete file
                                if os.path.exists(folder_path):
                                    os.remove(folder_path)
                            dateval = d['time']
                            chat[i] = {
                                "name" : name,
                                "text" : 'This message was deleted!',
                                "time" : dateval,
                                "email" :email,
                                "Status" : 'deleted',
                                "src" : '',
                                'upload' : '',
                                'action' : 'deleted from all',
                                'DelList' : [0],
                                'ReplyChatName' : '',
                                'ReplyChat' : '',
                                'id' : delId
                            }
                            break
                elif action !=None and action == 'delete from me':
                    for i, d in enumerate(chat):
                        if str(d['id']) == str(delId):
                            x = chat[i]['DelList'] 
                            msgemail = d['email']
                            msgval  = d['text']
                            msgname = d['name']
                            x.append(email)                        
                            ReplyChatval = chat[i]['ReplyChat'] if chat[i]['ReplyChat'] else '' 
                            dateval = d['time']
                            if len(x) >= 3:
                                if d['src'] != '' and d['src'] != 'null':
                                    file_path = str(d['src'])
                                    pathval = file_path.lstrip('/')
                                    folder_path = os.path.join(settings.MEDIA_ROOT, pathval)
                                    # delete file
                                    if os.path.exists(folder_path):
                                        os.remove(folder_path)
                                srcval = ''
                                uploadval = ''
                            else:
                                srcval = chat[i]['src']
                                uploadval = chat[i]['upload'] 
                            
                            chat[i] = {
                                "name" : msgname,
                                "text" : 'This message was deleted!' if len(x) >= 3 else msgval,
                                "time" : dateval,
                                "email" :  msgemail,
                                "Status" : 'deleted',
                                "src" : srcval,
                                'upload' : uploadval,
                                'action' : 'deleted from all' if len(x) >= 3 else 'deleted from me',
                                'DelList' : x,
                                'ReplyChatName' : ReplyChatval,
                                'ReplyChat' : ReplyChatval,
                                'id' : delId
                            }
                            break
                else:
                    chatlistLength = len(chat)
                    if src != '' and src != 'null':
                        srcval = f'{email}/chats/{inboxEmail}/{src}'
                    else:
                        srcval = ''
                    chat.append({
                        "name" : name,
                        "text" : message,
                        "time" : str(short_date),
                        "email" :email,
                        "Status" : 'send',
                        "src" : srcval,
                        'upload' : upload,
                        'action' : '',
                        'DelList' : [0],
                        'ReplyChatName' : ReplyChatName,
                        'ReplyChat' : ReplyChat,
                        'id' : chatlistLength + 1
                    })
            else:
                if src != '' and src != 'null':
                    srcval = f'{email}/chats/{inboxEmail}/{src}'
                chat = [{
                    "name" : name,
                    "text" : message,
                    "time" : str(short_date),
                    "email" :email,
                    "Status" : 'send',
                    "src" : src,
                    'upload' : upload,
                    'action' : '',
                    'DelList' : [0],
                    'ReplyChatName' : '',
                    'ReplyChat' : '',
                    'id' : 0
                }]
            x = PersonalChats.objects.all().values().filter(RecieverId = RecieverId,SenderId = SenderId)
            x.update(ChatLog = chat)

            PersonalChats.save 
            StartIndex = TopMessegeId if TopMessegeId != None else 0
            MessegeList = chat[int(StartIndex):]
            return  MessegeList #chat
        else:
            return ''
    except Exception as e:
        return ''

@circuit
@sync_to_async
def RequestMoreChatsLogFunc(data,scope):
    SenderIdval = sanitize_string(data['SenderId'])
    RecieverIdval = sanitize_string(data['RecieverId'])
    TopMessegeId = sanitize_string(data['TopMessegeId'])
    group_nameval = sanitize_string(data['group_name'])
    MessegeList = []
    
    try:        
        if scope == 'Chats':
            val =  list(PersonalChats.objects.all().values().filter( Q(SenderId = SenderIdval,RecieverId = RecieverIdval) | Q(RecieverId = SenderIdval,SenderId = RecieverIdval) )) 
            if(val[0]):
                chat = val[0]['ChatLog']
                if(chat != None):
                    StartIndex =  0 if int(TopMessegeId) - 1 < 0 else int(TopMessegeId) - 1
                    MessegeList = chat[:StartIndex][-5:]
                    
                else:                    
                    MessegeList = []
            else:
                MessegeList = []
        elif scope == 'Groups':
            val =  list(GroupChat.objects.all().values().filter(group_name = group_nameval))
            if(val[0]):
                chat = val[0]['ChatLogs']
                if(chat != None):
                    StartIndex =  0 if int(TopMessegeId) - 1 < 0 else int(TopMessegeId) - 1
                    MessegeList = chat[:StartIndex][-5:]
                else:                    
                    MessegeList = []
            else:
                MessegeList = []
        elif scope == 'Community':
            val =  list(CommunityChat.objects.all().values().filter(group_name = group_nameval)) 
            if(val[0]):
                chat = val[0]['ChatLogs']
                if(chat != None):
                    StartIndex =  0 if int(TopMessegeId) - 1 < 0 else int(TopMessegeId) - 1
                    MessegeList = chat[:StartIndex][-5:]
                else:                    
                    MessegeList = []
            else:
                MessegeList = []

        responseval = {'type' : 'success','scope' : scope,'ChatMessege' : MessegeList}
        return responseval
    except Exception as e:
        print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval

@circuit
@database_sync_to_async
def RemoveRequest( id, room_name,scope = None):
    RequestTable.objects.filter(RoomName = room_name,UserId = id).delete()
    return {'status' : 'success','message': 'Request Removed'}


@circuit
@database_sync_to_async
def JoinRequest (email, id, room_name,name,profilePic,scope = None,groupname = None):
    try:
        creator = list(GroupChat.objects.all().values().filter(group_name = room_name))
        CreatorEmail = creator[0]['Creator']
        creatorAccountRef = Account.objects.get(email = CreatorEmail)
        groupnameval = str(groupname)
        data =  list(RequestTable.objects.all().values().filter(UserId = id,RoomName =room_name))
        now = datetime.datetime.now()
        short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
        if(len(data) != 0 and email != 'null' and email != 'gestuser@gmail.com'):
            if(data[0]['status'] != 'Banned' and data[0]['status'] != 'Reject' and data[0]['status'] != 'Accepted'):
                RequestTable.objects.filter(RoomName = room_name,id = id).delete()

                user = [{
                    'email' : email,
                    'UserPic' : profilePic,
                    'name' : name
                }]
                RequestTable.objects.create(UserId = id,RoomName = room_name,UserDetails = user,Creator = CreatorEmail,groupname =groupnameval,account_email = creatorAccountRef,dateRequested = str(short_date)  )
                
            else:
                msg = data[0]['status'] 
                return {'status' : 'warning','message': f'{msg} by Owner'}
        elif email == 'gestuser@gmail.com':
            return {'status' : 'error','message': 'Sign up to manage chats'}
        else:
                user = [{
                    'email' : email,
                    'UserPic' : profilePic,
                    'name' : name
                }]
                RequestTable.objects.create(UserId = id,RoomName = room_name,UserDetails = user,Creator = CreatorEmail,groupname =groupnameval,account_email = creatorAccountRef,dateRequested = str(short_date)  )
                
                return {'status' : 'success','message': 'Request made successfuly'}

    except Exception as e:
        return {'status' : 'error','message': 'Sign up to manage chats'}

@circuit
@database_sync_to_async
def UpdateRequest (email, room_name,choice,id,name):
    try:      
        data =  GroupChat.objects.get(group_name = room_name)
        if(data):
            x = RequestTable.objects.all().values().filter(RoomName = room_name,id = id)     
            if(choice == 'Accept'):
                #x.update(status = 'True')
                
                RequestTable.objects.filter(RoomName = room_name,id = id).delete()
                GroupChatUsersList.objects.create(name = name,email = email,group_ref = data)
                
            elif choice == 'Delete':
                RequestTable.objects.filter(RoomName = room_name,id = id).delete()
                return {'status' : 'success','message': 'Request deleted'}
            else:
                x.update(status = choice)
                #data['UsersList'].append(email)
                #RequestTable.save
            return {'status' : 'success','message': 'Request Updated'}
            
        else:
            return {'status' : 'error','message': 'No such group'}
    except Exception as e:
       return {'status' : 'error','message': 'No such group'} 

@circuit
@database_sync_to_async
def GetRequestMade( id):    
    try:
        data =  RequestTable.objects.all().values().filter(UserId = id)
        responseval = RequestTableSerializer(data,many=True)
        return responseval.data
    except Exception as e:
        print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval         
    


@circuit
@database_sync_to_async
def RequestsList (email):
    try:
        accontRef = Account.objects.get(email = email)
        listval = accontRef.requestTable.all()
        responsedata = RequestTableSerializer(listval,many=True)
        
        return  {'type' : 'success','data' : responsedata.data}
    except Exception as e:
        print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval



@circuit
@database_sync_to_async
def CreateFriend(SenderId,RecieverId,detailval):
    try:
        if(SenderId != 'null' and RecieverId != 'null'):
                exist = list(PersonalChats.objects.all().filter(Q(SenderId = SenderId,RecieverId = RecieverId) | Q(RecieverId = SenderId,SenderId = RecieverId) ))
                if(len(exist) == 0):
                    room = detailval[0]
                    now = datetime.datetime.now()
                    short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
                    
                    x = PersonalChats.objects.all().create(group_name = room,RecieverId = RecieverId,SenderId = SenderId,DateCreated = str(short_date),ChatLog = [],Details = detailval[1])
                    x.save
                    return {'status' : 'success','message': 'User added to your Chats'}
                else :
                    return {'status' : 'warning','message': 'User exists in your Chats'}
        else:
            return {'status' : 'error','message': 'Invalid Inputs'}
    except Exception as e:

        return {'status' : 'error','message': 'Invalid Inputs'}

##chats personal private
@circuit
@database_sync_to_async
def SuggestionsLogsFunc(SearchUserval,RecieverIdval,IsContinue,ContinuetionId):
    try:
        if IsContinue == 'True':
            listval = PersonalChats.objects.filter(Q(RecieverId='') & ~Q(SenderId=RecieverIdval) & ( Q(email__icontains = SearchUserval) | Q(name__icontains = SearchUserval)) & Q(id__gt=ContinuetionId) )[:20]    
            responseval = PersonalChatsSerializer(listval,many=True)
        else:
            listval = PersonalChats.objects.filter(Q(RecieverId='') & ~Q(SenderId=RecieverIdval) & ( Q(email__icontains = SearchUserval) | Q(name__icontains = SearchUserval)) )[:20]    
            responseval = PersonalChatsSerializer(listval,many=True)
        dataval = {'status' : 'success','IsContinue' : IsContinue,'data' : responseval.data}
        return dataval
    except Exception as e:
        return {'status' : 'error'}

@circuit
@database_sync_to_async
def SuggestionsGroupsLogsFunc(SearchUserval,IsContinue,ContinuetionId):
    try:
        if IsContinue == 'True':
            listval = GroupChat.objects.filter(Q(title__icontains = SearchUserval) & Q(id__gt=ContinuetionId) )[:20]    
            responseval = GroupChatSerializer(listval,many=True)
        else:
            listval = GroupChat.objects.filter(Q(title__icontains = SearchUserval))[:20]    
            responseval = GroupChatSerializer(listval,many=True)
        dataval = {'status' : 'success','IsContinue' : IsContinue,'data' : responseval.data}
        return dataval
    except Exception as e:
        val = {'status' : 'error','message': 'Sign up to manage chats'}
        return val
@circuit
@database_sync_to_async
def NotePadlogs(email):
    try:
        val = list(NotePad.objects.all().filter(email = email).values())
        return val
    except Exception as e:
        return []


@circuit
@database_sync_to_async
def AddNoteFunc(email,title):
    now = datetime.datetime.now()
    short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
    try:
        x = NotePad.objects.create(
        email = str(email),
        DateCreated = str(short_date),
        title = str(title)    
        )
        x.save
    except Exception as e:
        return {'status' : 'warning','message': f'Duplicate title found, please use a different title'}

    
    val = list(NotePad.objects.all().filter(email = email).values())
    return val

@circuit
@database_sync_to_async
def SubmitNoteFunc (email,text,title):
    try:
        data = list(NotePad.objects.all().filter(email = email,title = title).values())
        if(len(data) != 0 and email != 'null'):
            now = datetime.datetime.now()
            short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
            x = NotePad.objects.all().filter(email = email,title = title).values()
            chat = data[0]['NoteLog']
            if(chat != None):             
                chat.append({
                    "text" : text,
                    "time" : str(short_date),
                })
            else:
                chat = [{
                    "text" : text,
                    "time" : str(short_date),
                }]
            x.update(NoteLog = chat)
            valtext = text[:15]
            x.update(LastText = str(valtext))
            NotePad.save 
            return chat

        else:
            return {'status' : 'warning','message': f'Invalid data or Chat not found'}

    except Exception as e:
       return {'status' : 'warning','message': f'Invalid data or Chat not found'}
@circuit
@database_sync_to_async
def NotePadlogsDelete(email,title):
    try:
        NotePad.objects.filter(email = email,title = title).delete()
        val = list(NotePad.objects.all().filter(email = email).values())
        return val
    except Exception as e:
        return {'status' : 'error','message': f'Error occured when deleting note.'}


@circuit
@database_sync_to_async
def EditProfileFunc(about,email,name,ProfilePic = None):
    try:
        x = Account.objects.all().filter(email = email)
        #picval = f'http://127.0.0.1:8000/media/{ProfilePic}'

        x.update(name = name,about=about)
        # if ProfilePic != 'null':
        #     x.update(name = name,about=about)
        # else:
        #     x.update(name = name,about=about)
        Account.save

        responseval =  {'status' : 'success','message' : 'Profile Updated'}

        return responseval
    except Exception as e:
        responseval =  {'status' : 'error','message' : 'invalid account'}
        return responseval

@circuit
@database_sync_to_async
def StartNewChatFunc(group_name,SenderId,RecieverId,Details,email):
    try:
        if group_name != '' and group_name != 'null' and SenderId != '' and SenderId != 'null' and RecieverId != '' and RecieverId != 'null':
            now = datetime.datetime.now()
            short_date = str(now.strftime("%I:%M:%S %p"))
            customChat = [{
                "name" : sanitize_string(Details[email]['name']),
                "text" : '/Start',
                "time" : short_date,
                "email" :email,
                "Status" : 'send',
                "src" : '',
                'upload' : '',
                'action' : '',
                'DelList' : [0],
                'ReplyChatName' : '',
                'ReplyChat' : ''
            }]
            PersonalChats.objects.create(group_name = group_name,SenderId = SenderId,RecieverId = RecieverId,Details=Details,DateCreated= short_date,ChatLog = customChat)
            return 'True'
        else:
            return 'False'
    except Exception as e:
        return 'False'

@circuit
@sync_to_async
def ToogleOnline(props,email = None):    
    try:  
        if props == 'AddOnline':
            val = list(OnlineStatus.objects.all().values())
            emailval = sanitize_string(email)
            if len(val) != 0:
                onlineval = val[0]['online']
                lastseenval = val[0]['lastSeen']
                if(onlineval != None):
                    if emailval not in onlineval:
                        onlineval.append(emailval)

                    if lastseenval != None:
                        i =0 
                        for i in lastseenval:
                            if i['email'] == emailval:
                                lastseenval.remove(i)
                        
                    OnlineStatus.objects.update(online=onlineval,lastSeen = lastseenval,id=1)
                    OnlineStatus.save
                    return [onlineval,lastseenval]
                else:
                    newOnlineVal = [emailval]
                    if lastseenval != None:
                        i =0 
                        for i in lastseenval:
                            if i['email'] == emailval:
                                lastseenval.remove(i)
                    OnlineStatus.objects.update(online=newOnlineVal,lastSeen = lastseenval,id=1)
                    OnlineStatus.save
                    return [newOnlineVal,lastseenval]
                
            else:
                newOnlineVal = [emailval]
                lastseenval = val[0]['lastSeen'] if len(val) != 0 else []
                OnlineStatus.objects.create(online=newOnlineVal,lastSeen = lastseenval)
                OnlineStatus.save
                return [newOnlineVal,lastseenval]
        elif props == 'AddLastSeen':
            val = list(OnlineStatus.objects.all().values())
            emailval = sanitize_string(email)
            if len(val) != 0:
                onlineval = val[0]['online']
                lastseenval = val[0]['lastSeen']
                now = datetime.datetime.now()
                short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
                if(onlineval != None):
                    if emailval in onlineval:
                        onlineval.remove(emailval)
                if lastseenval != None:
                    mylastseen = {
                        'email' : emailval,
                        'time' : str(short_date)
                    }
                    index = 0
                    IsNotAppend = False
                    for index in lastseenval:
                        if index['email'] == emailval:
                            IsNotAppend = True
                            break
                    if IsNotAppend == False:
                        lastseenval.append(mylastseen)
                elif lastseenval == None:
                    mylastseen = {
                        'email' : emailval,
                        'time' : str(short_date)
                    }
                    lastseenval = [mylastseen]
                OnlineStatus.objects.update(online=onlineval,lastSeen = lastseenval,id=1)
                OnlineStatus.save
                return [onlineval,lastseenval]
            
        else:
            onlineval = val[0]['online'] if len(val) != 0 else []
            if(onlineval != None):
                if emailval in onlineval:
                    onlineval.remove(emailval)
            mylastseen = {
                        'email' : emailval,
                        'time' : str(short_date) }
            lastseenval = [mylastseen]
            onlineval = []
            OnlineStatus.objects.create(lastSeen=lastseenval,online=onlineval)
            OnlineStatus.save
            return [onlineval,lastseenval]
    except Exception as e:
        return [[],[]]

def SerealizePostDataFunc (data,email):
    postData = data
    if postData:
        for x in postData:
            #print(x)
            postref = Post.objects.get(id = x['id'])
            commentLength = PostComment.objects.filter(post_id = postref).count()
            x['CommentNumber'] = commentLength
            likes = x['likes']
            #print(likes)
            if likes != None:
                lengthval = len(likes)
                x['likes'] = lengthval
                if email in likes:
                    x['IsUserLiked'] = True
                else:
                    x['IsUserLiked'] = False
                
            else:
                x['likes'] = 0
                x['IsUserLiked'] = False
        return postData

def SerealizeSinglePostDataFunc (data,email):
    postData = data
    if postData:
        postref = Post.objects.get(id = postData['id'])
        commentLength = PostComment.objects.filter(post_id = postref).count()
        postData['CommentNumber'] = commentLength
            #print(x)
        likes = postData['likes']
        #print(likes)
        if likes != None:
            lengthval = len(likes)
            postData['likes'] = lengthval
            if email in likes:
                postData['IsUserLiked'] = True
            else:
                postData['IsUserLiked'] = False
        else:
            postData['likes'] = 0
            postData['IsUserLiked'] = False
        return postData

@circuit
@sync_to_async
def RequestProfilePostsFunc(id,email,IsOwner,Position,continuetion):
    emailval = email
    account = Account.objects.get(id=id)
    idval = Position

    try:
        if idval != 'null':
            # Step 2: Get related posts with id greater than or equal to a specific value
            if IsOwner == 'True':
                posts = account.posts.filter(id__gte=idval)[:5] # fetching a maximum of 5 posts 
            else:
                posts = account.posts.filter(Q(id__gte=idval) & Q(postPrivacy = 'public'))[:5] # fetching a maximum of 5 posts 
            serializedData = PostSerializer(posts, many=True)
            
            responsedata = serializedData.data
            PostData = SerealizePostDataFunc(data=responsedata,email=emailval)
        else:
            # Step 2: Get related posts with id greater than or equal to a specific value
            if IsOwner == 'True':
                posts = account.posts.all().order_by('id')[:5] # fetching a maximum of 5 posts 
            else:
                posts = account.posts.filter(Q(postPrivacy = 'public'))[:5] # fetching a maximum of 5 posts 
                
            serializedData = PostSerializer(posts, many=True)
            responsedata = serializedData.data
            PostData = SerealizePostDataFunc(data=responsedata,email=emailval)
        return {'status' : 'success','Posts' : PostData, 'continuetion' : continuetion}
    except Exception as e:
        #print(e)
        reponseval = {'status' : 'error','messege' : 'invalid data'}
        return reponseval



@circuit
@sync_to_async
def RequestProfileCommentsFunc(Position,continuetion = False,continuetionId = None):
    index = sanitize_string(Position)
    try:
        #print(continuetion,continuetionId)
        if continuetion == 'True': 
            post_instance = Post.objects.get(id=index)
            commentData = post_instance.comments.filter(id__lt=continuetionId).order_by('-id')[:10][::-1]
            # idval = Position
            #     # Step 2: Get related posts with id greater than or equal to a specific value
            # posts = account.posts.filter(id__gte=idval)[:5] # fetching a maximum of 5 posts 
            serializedData = PostCommentSerializer(commentData, many=True)
            responsedata = serializedData.data
            #returning [commentdata,postid,isCommentContinuetion]
            return [responsedata,Position,True]
        else:
            post_instance = Post.objects.get(id=index)
            commentData = post_instance.comments.all().order_by('-id')[:10][::-1]
            # idval = Position
            #     # Step 2: Get related posts with id greater than or equal to a specific value
            # posts = account.posts.filter(id__gte=idval)[:5] # fetching a maximum of 5 posts 
            serializedData = PostCommentSerializer(commentData, many=True)
            responsedata = serializedData.data
            return [responsedata,Position,False]
    except Exception as e:
        #print(e)
        reponseval = {'status' : 'error','messege' : 'invalid data'}
        return reponseval



@circuit
@sync_to_async
def SendPostCommentFunc(data):
    index = sanitize_string(data['postid'])
    emailval = sanitize_string(data['CommentUserDetails']['email'])
    try:
        if emailval == 'gestuser@gmail.com' or emailval == 'null' or emailval == '':
                reponseval = {'status' : 'error','messege' : 'invalid account'}
                return reponseval
        now = datetime.datetime.now()
        short_date = now.strftime("%Y-%m-%dT%H:%M:%S")
        post_instance = Post.objects.get(id=index)
        account_instance = Account.objects.get(email = emailval)
        msg = sanitize_string(data['messege'])
        commentVal = PostComment.objects.create(
            message=msg,
            post_id=post_instance,  # Pass the Post instance
            account_email=account_instance,
            CommentUserDetails={
                "profilePic":data['CommentUserDetails']['profilePic'] , 
                "name": data['CommentUserDetails']['name'],
                'userID' : data['CommentUserDetails']['userID']
                },
            dateCommented= str(short_date),
            replyCommentDetails=data['replyCommentDetails']
        )
        #commentData = post_instance.comments.filter(id = commentVal.id)
        commentsLength = post_instance.comments.count()
        
        # idval = Position
        #     # Step 2: Get related posts with id greater than or equal to a specific value
        # posts = account.posts.filter(id__gte=idval)[:5] # fetching a maximum of 5 posts 
        serializedData = PostCommentSerializer(commentVal, many=False)
        responsedata = serializedData.data
        return [responsedata,commentsLength]
    except Exception as e:
        #print(e)
        reponseval = {'status' : 'error','messege' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def RequestDeleteCommentFunc(data):
    #print(data,data['commentEmail'],data['commentId'],data['postId'])

    try:
        commentEmail = sanitize_string(data['commentEmail'])
        if commentEmail == 'gestuser@gmail.com' or commentEmail == 'null' or commentEmail == '' :
            reponseval = {'status' : 'error','messege' : 'invalid account'}
            return reponseval
        
        commentId = data['commentId']
        postId = data['postId']
        PostComment.objects.filter(account_email = commentEmail,id = commentId).delete()
        commentsLength = PostComment.objects.filter(post_id = postId).count()
        reponseval = {'status' : 'success','messege' : 'Comment deleted','data' : [commentId,postId,commentsLength]}
        return reponseval
    except Exception as e:
        #print(e)
        reponseval = {'status' : 'error','messege' : 'invalid comment credentials'}
        return reponseval


@circuit
@sync_to_async
def RequestLikePostFunc(data):
    #print(data,data['commentEmail'],data['commentId'],data['postId'])
    try:
        emailval = sanitize_string(data['userEmail'])
        postId = data['postId']
        AccountActive = Account.objects.filter(email = emailval).exists()
        if AccountActive and (emailval != 'gestuser@gmail.com' and emailval != 'null' and emailval != ''):
            x = Post.objects.filter(id = postId).first()

            likedata = x.likes
            #print(likedata)
            if(likedata != None):
                if emailval in likedata:
                    likedata.remove(emailval)
                elif emailval not in likedata:
                    likedata.append(emailval)
            else:
                likedata = [emailval]
            post = Post.objects.filter(id = postId)
            post.update(likes = likedata)
            x = Post.objects.filter(id = postId).first()
            serializedData = PostSerializer(x, many=False)
            responsedata = [serializedData.data]
            PostData = SerealizePostDataFunc(data=responsedata,email=emailval)
            
            reponseval = {'status' : 'success','messege' : 'post liked','data' : PostData[0]}
            return reponseval
        else:
            reponseval = {'status' : 'error','messege' : 'Invalid or account frozen'}
            return reponseval
        
    except Exception as e:
        print(e)
        reponseval = {'status' : 'error','messege' : 'error occured, probably invalid credentials'}
        return reponseval

@circuit
@sync_to_async
def RequestPostsFunc(email,Position,direction = False,continuetion = False):
    #print(Position,email,type(Position))
    try:
        if Position != 'None' and email != None and Position != None :
            if direction == 'next':
                posts = Post.objects.filter(Q(id__gt=Position) & Q(postPrivacy='public')).order_by('id')[:5] # fetching a maximum of 5 posts 
            elif direction == 'back':
                posts = Post.objects.filter(Q(id__lt=Position) & Q(postPrivacy='public')).order_by('id')[:5] # fetching a maximum of 5 posts 
            else:
                posts = Post.objects.filter(Q(id__gte=Position) & Q(postPrivacy='public')).order_by('id')[:5] # fetching a maximum of 5 posts 
            serializedData = PostSerializer(posts, many=True)
            responsedata = serializedData.data
            PostData = SerealizePostDataFunc(data=responsedata,email=email)
        else:
            posts = Post.objects.filter(postPrivacy='public').order_by('id')[:5] # fetching a maximum of 5 posts 
            serializedData = PostSerializer(posts, many=True)
            responsedata = serializedData.data
            PostData = SerealizePostDataFunc(data=responsedata,email=email)
        return [PostData,continuetion,direction]
    except Exception as e:
        #print(e)
        reponseval = {'status' : 'error','result' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def MakePostPublicFunc(data):
    try:
        if data:
            idval = sanitize_string(data['PostId'])
            emailval = sanitize_string(data['AccountEmail'])
            if emailval == 'gestuser@gmail.com' or emailval == 'null' or emailval == '':
                reponseval = {'type' : 'error','status' : 'error','result' : 'Sign up to manage posts'}
                return reponseval
            x = Post.objects.filter(id = idval)
            x.update(postPrivacy = 'public')
            
            accountref = Account.objects.get(email = emailval)
            x = Post.objects.filter(id = idval,account_email = accountref).first()
            serializedData = PostSerializer(x, many=False)
            profilePost = serializedData.data
            PostData = SerealizeSinglePostDataFunc(data=profilePost,email=emailval)
            #serializedData = PostSerializer(profilePost, many=True)
            responseval = {'type' : 'success','result' : 'Post updated successfuly','posts' : PostData}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid credentials'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval
    
@circuit
@sync_to_async
def MakePostPrivateFunc(data):
    try:
        if data:
            idval = sanitize_string(data['PostId'])
            emailval = sanitize_string(data['AccountEmail'])
            if emailval == 'gestuser@gmail.com' or emailval == 'null' or emailval == '':
                reponseval = {'type' : 'error','status' : 'error','result' : 'Sign up to manage posts'}
                return reponseval
            x = Post.objects.filter(id = idval)
            x.update(postPrivacy = 'private')
            accountref = Account.objects.get(email = emailval)
            x = Post.objects.filter(id = idval,account_email = accountref).first()
            serializedData = PostSerializer(x, many=False)
            profilePost = serializedData.data
            PostData = SerealizeSinglePostDataFunc(data=profilePost,email=emailval)
            #serializedData = PostSerializer(profilePost, many=True)
            responseval = {'type' : 'success','result' : 'Post updated successfuly','posts' : PostData}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid credentials'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def RequestSavePostFunc(data):
    try:
        if data:
            idval = sanitize_string(data['PostId'])
            emailval = sanitize_string(data['AccountEmail'])
            if emailval == 'null' and emailval == 'gestuser@gmail.com' and emailval == '':
                responseval = {'type' : 'error','result' : 'SignUp to save the post'}
                return responseval
            postref = Post.objects.get(id = idval)
            accountref = Account.objects.get(email = emailval)        
            SavedPost.objects.create(account_email =accountref,post=postref)
            responseval = {'type' : 'success','result' : 'Post saved successfuly'}
            return responseval
        else:
            responseval = {'type' : 'warning','result' : 'invalid credentials or post already saved'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'warning','status' : 'error','result' : 'invalid data or post already saved'}
        return reponseval

@circuit
@sync_to_async
def RequestSavedPostFunc(email):
    try:
        if email != 'null' and email != 'gestuser@gmail.com' and email != '':
            emailval = sanitize_string(email)        
            account_ref = Account.objects.get(email = emailval)
            saved_posts = SavedPost.objects.filter(account_email=account_ref).select_related('post') # Filter SavedPost by Account instance
            savedpostData = SavedPostSerializer(saved_posts,many=True)
            PostData = SerealizePostDataFunc(data=savedpostData.data,email=emailval)
            
            responseval = {'type' : 'success','result' : 'successfuly fetched','Posts' : PostData}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'SignUp to manage post'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def DeleteSavedPostFunc(data):
    try:

        if data:
            idval = sanitize_string(data['PostId'])
            emailval = sanitize_string(data['AccountEmail'])
            if emailval == 'null' or emailval == '' or emailval == 'gestuser@gmail.com':
                responseval = {'type' : 'error','result' : 'invalid credentials'}
                return responseval
            postref = Post.objects.get(id = idval)
            accountref = Account.objects.get(email = emailval)        
            SavedPost.objects.filter(account_email =accountref,post=postref).delete()
            saved_posts = SavedPost.objects.filter(account_email=accountref).select_related('post')[:5]  # Filter SavedPost by Account instance
            savedpostData = SavedPostSerializer(saved_posts,many=True)
            PostData = SerealizePostDataFunc(data=savedpostData.data,email=emailval)
            responseval = {'type' : 'success','result' : 'Post deleted successfuly','Posts' : PostData}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid credentials'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','messege' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def RequestFolderDataFunc(email):
    try:
        if email :
            emailval = email
            if emailval == 'null' or emailval == '' or emailval == 'gestuser@gmail.com':
                responseval = {'type' : 'error','result' : 'Sign Up to manage repository'}
                return responseval
            accountref = Account.objects.get(email = emailval) 
            foldetData = accountref.folders.all().order_by('id')
            foldet_val = FolderTableSerializer(foldetData,many=True)
            responseval = {'type' : 'success','result' : 'successful','list' : foldet_val.data}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid data'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def RequestAddFolderFunc(email,foldername):
    try:
        if email and foldername:
            emailval = email
            if emailval == 'null' or emailval == '' or emailval == 'gestuser@gmail.com':
                responseval = {'type' : 'error','result' : 'Sign Up to manage repository'}
                return responseval
            now = datetime.datetime.now()
            short_date = now.strftime("%d-%m-%Y")
            accountref = Account.objects.get(email = emailval)    
            FolderTable.objects.create(
                title = foldername,
                dateCreated = str(short_date),
                account_email = accountref
            )
            foldetData = accountref.folders.all().order_by('id')
            foldet_val = FolderTableSerializer(foldetData,many=True)
            responseval = {'type' : 'success','result' : 'Folder added','list' : foldet_val.data}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid data'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def RequestFolderFilesFunc(email,folderId):
    try:
        if email != None and folderId != None:
            emailval = email
            if emailval == 'null' or emailval == '' or emailval == 'gestuser@gmail.com':
                responseval = {'type' : 'error','result' : 'Sign Up to manage repository'}
                return responseval
            accountref = Account.objects.get(email = emailval) 
            foldetData = FolderTable.objects.get(account_email = accountref,id = folderId)
            fileData = foldetData.files.all().order_by('id')
            file_val = FileTableSerializer(fileData,many=True)
            responseval = {'type' : 'success','result' : 'successful','list' : file_val.data}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid data'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def RequestEditfolderNameFunc(data):
    try:
        emailval = sanitize_string(data['AccountEmail'])
        folderId = sanitize_string(data['folderId'])
        foldername = sanitize_string(data['name'])
        if emailval != None and folderId != None and foldername != '':            
            if emailval == 'null' or emailval == '' or emailval == 'gestuser@gmail.com':
                responseval = {'type' : 'error','result' : 'Sign Up to manage repository'}
                return responseval
            accountref = Account.objects.get(email = emailval) 
            xval =  FolderTable.objects.filter(account_email = accountref,id = folderId)
            xval.update(title = foldername)
            foldetData = accountref.folders.all().order_by('id')
            folder_val = FolderTableSerializer(foldetData,many=True)
            responseval = {'type' : 'success','result' : 'Folder successfully edited','list' : folder_val.data}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid data'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def RequestDeleteFolderFunc(email,folderId):
    try:
        if email != None and folderId != None:
            emailval = email
            if emailval == 'null' or emailval == '' or emailval == 'gestuser@gmail.com':
                responseval = {'type' : 'error','result' : 'Sign Up to manage repository'}
                return responseval
            accountref = Account.objects.get(email = emailval)
            folderref = FolderTable.objects.get(id = folderId,account_email = email) 
            filesData = FileTable.objects.filter(folder_id = folderref,account_email = accountref)
            filesVal = FileTableSerializer(filesData,many=True)
            filesSerialized = filesVal.data
            folder_path = os.path.join(settings.MEDIA_ROOT, emailval)
            x = 0
            if os.path.exists(folder_path):
                for x in filesSerialized:
                    fileurl = x['name']
                    idval = x['id']
                    FileTable.objects.filter(id = idval,account_email= accountref,folder_id = folderref).delete()
                  
                    Post_file_path = os.path.join(settings.MEDIA_ROOT,emailval,'repository',fileurl)
                    os.remove(Post_file_path)
            else:
                responseval = {'type' : 'error','result' : 'invalid data'}
                return responseval
            #deleting folder
            folderref.delete()
            
            #returning folders data list
            foldetData =  accountref.folders.all().order_by('id')         
            folder_val = FolderTableSerializer(foldetData,many=True)  
            responseval = {'type' : 'success','result' : 'Folder Deleted','list' : folder_val.data}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid data'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval


@circuit
@sync_to_async
def RequestDeleteRepositoryFileFunc(data):
    email = sanitize_string(data['AccountEmail'])
    FileId = sanitize_string(data['fileId'])
    filename = sanitize_string(data['filename'])
    folderId = sanitize_string(data['FolderId'])
    try:
        if email != None and FileId != None and folderId != None:
            emailval = email
            if emailval == 'null' or emailval == '' or emailval == 'gestuser@gmail.com':
                responseval = {'type' : 'error','result' : 'Sign Up to manage repository'}
                return responseval
            accountref = Account.objects.get(email = emailval) 
            #deleting file
            folder_path = os.path.join(settings.MEDIA_ROOT, email)
            if os.path.exists(folder_path):
                Post_file_path = os.path.join(settings.MEDIA_ROOT,email,'repository',filename)
                os.remove(Post_file_path)
            #file deleted
            FileTable.objects.filter(account_email=accountref,id= FileId).delete()
            foldetData = FolderTable.objects.get(account_email = accountref,id = folderId)
            fileData = foldetData.files.all().order_by('id')
            file_val = FileTableSerializer(fileData,many=True)
            responseval = {'type' : 'success','result' : 'Deleted successful','list' : file_val.data}
            return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid data'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval

@circuit
@sync_to_async
def RequestProfileNetworkFunc(UserEmail,AccountID,scope,continuetionId = None ,continuetion = False):
    try:
        if UserEmail != None and AccountID != None :
            accountExists = Account.objects.filter(email = UserEmail).exists()
            if accountExists == False:
                responseval = {'type' : 'error','result' : 'Sign Up to manage account'}
                return responseval
            if continuetion == 'True': 
                account_followed = Account.objects.get(id = AccountID)
                followinglist = []
                followerslist = []
                if scope == 'followers':
                    followersval = AccountFollowers.objects.filter(Q(followed_id=account_followed) & ~Q(follower_id = account_followed) & Q(id__gt = continuetionId)).order_by('id')[:100]
                    serializedfollowersval = FollowersDetailsListsSerializer(followersval,many = True)
                    followerslist = serializedfollowersval.data
                elif scope == 'following':
                    followingval = AccountFollowers.objects.filter(~Q(followed_id=account_followed) & Q(follower_id = account_followed) & Q(id__gt = continuetionId)).order_by('id')[:100]
                    serializedfollowingval = FollowingDetailsListsSerializer(followingval,many = True)
                    followinglist = serializedfollowingval.data
                
                responseval = {'type' : 'success','result' : 'Deleted successful','followerslist' : followerslist,'followinglist' : followinglist,'scope' : scope,'continuetion' : continuetion}
                
            else:
                account_followed = Account.objects.get(id = AccountID)
                followersval = AccountFollowers.objects.filter(Q(followed_id=account_followed) & ~Q(follower_id = account_followed)).order_by('id')[:100]
                serializedfollowersval = FollowersDetailsListsSerializer(followersval,many = True)
                followerslist = serializedfollowersval.data
                followingval = AccountFollowers.objects.filter(~Q(followed_id=account_followed) & Q(follower_id = account_followed)).order_by('id')[:100]
                serializedfollowingval = FollowingDetailsListsSerializer(followingval,many = True)
                followinglist = serializedfollowingval.data

                responseval = {'type' : 'success','result' : 'Deleted successful','followerslist' : followerslist,'followinglist' : followinglist,'scope' : scope,'continuetion' : continuetion}
            return responseval    
        else:
            responseval = {'type' : 'error','result' : 'invalid data'}
            return responseval
    except Exception as e:
        #print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval


@circuit
@sync_to_async
def RequestDeleteInboxFunc(data):
    email = sanitize_string(data['email'])
    scope = sanitize_string(data['scope'])
    inboxId = sanitize_string(data['inboxId'])
    userid = sanitize_string(data['id'])
    inboxEmail = sanitize_string(data['inboxEmail'])
    
    try:
        if email != None and userid != None and inboxEmail != None:
            emailval = email
            if emailval == 'null' or emailval == '' or emailval == 'gestuser@gmail.com':
                responseval = {'type' : 'error','result' : 'Sign Up to manage chats'}
                return responseval
            accountref = Account.objects.filter(email = emailval)
            isaccount = accountref.exists()
            if not isaccount:
                responseval = {'type' : 'error','result' : 'Sign Up to manage chats'}
                return responseval
            if scope == 'Chats':
                folder_path = os.path.join(settings.MEDIA_ROOT, email)
                inbox_folder_path = os.path.join(settings.MEDIA_ROOT,email,'chats',inboxEmail)
                inbox_folder_path1 = os.path.join(settings.MEDIA_ROOT,inboxEmail,'chats',email)
                # delete file
                if os.path.exists(folder_path):
                    try:
                        shutil.rmtree(inbox_folder_path)
                    except:
                        pass
                    try:
                        shutil.rmtree(inbox_folder_path1)
                    except:
                        pass                    
                PersonalChats.objects.filter(Q(SenderId = userid,RecieverId = inboxId) | Q(RecieverId = userid,SenderId = inboxId)).delete()
                val = PersonalChats.objects.filter( (Q(SenderId = userid) | Q(RecieverId = userid)) & (~Q(SenderId='') & ~Q(RecieverId=''))  )
                responseval = PersonalChatsSerializer(val,many=True)
                responseval = {'type' : 'success','scope' : scope,'result' : 'Deleted successful','list' : responseval.data}
                return responseval
            elif scope == 'Groups':
                pathval = f'{email}Groups{inboxId}'
                folder_path = os.path.join(settings.MEDIA_ROOT, pathval)
                # delete file
                if os.path.exists(folder_path):                    
                    try:
                        shutil.rmtree(folder_path)
                    except:
                        pass
                GroupChat.objects.filter(Creator = email).delete()
                val = GroupChat.objects.all()
                responseval = GroupChatSerializer(val,many=True)
                responseval = {'type' : 'success','scope' : scope,'result' : 'Deleted successful','list' : responseval.data}
                return responseval
            elif scope == 'Community':
                pathval = f'{email}Community{inboxId}'
                folder_path = os.path.join(settings.MEDIA_ROOT, pathval)
                # delete file
                if os.path.exists(folder_path):
                    try:
                        shutil.rmtree(folder_path)
                    except:
                        pass
                CommunityChat.objects.filter(Creator = email).delete()
                val = CommunityChat.objects.all()
                responseval = CommunityChatSerializer(val,many=True)
                responseval = {'type' : 'success','scope' : scope,'result' : 'Deleted successful','list' : responseval.data}
                return responseval
        else:
            responseval = {'type' : 'error','result' : 'invalid data'}
            return responseval
    except Exception as e:
        print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval


@circuit
@sync_to_async
def RequestAICarouselsFunc(UserEmail):
    
    try:
        if UserEmail != None and UserEmail != 'null' or UserEmail != '':
            accountref = Account.objects.filter(email = UserEmail)
            isaccount = accountref.exists()
            if not isaccount:
                responseval = {'type' : 'error','result' : 'Create an account to manage this feutures'}
                return responseval
            val = AiPageCarousels.objects.all()
            serialized = AiPageCarouselsSerializer(val,many=True)
            reponseval = {'type' : 'success','status' : 'success','list' : serialized.data}
            return reponseval
        else:
            responseval = {'type' : 'error','result' : 'invalid data'}
            return responseval
    except Exception as e:
        print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval
#print(settings.AI_MODEL)
COLAB_API_URL = 'https://745d-35-247-188-148.ngrok-free.app' # os.environ.get("COLAB_API_URL")
API_KEY = os.environ.get("COLAB_API_KEY")

async def RequestTextToImageAIFunc(UserEmail, prompt):
    try:
        if not prompt or prompt.lower() == "null":
            return {"type": "warning", "result": "Your prompt is empty, please provide one."}

        # Check if account exists (assuming Django ORM)
        account_exists = await sync_to_async(Account.objects.filter(email=UserEmail).exists)()
        if not account_exists:
            return {"type": "warning", "result": "Create an account to use this AI"}

        # Prepare request payload
        payload = json.dumps({"prompt": prompt})
        headers = {"Content-Type": "application/json"}

        print("Calling request from Colab API...\n",f"{COLAB_API_URL}/generate/")

        # Use aiohttp for async requests
        async with aiohttp.ClientSession() as session:
            async with session.post(f"https://745d-35-247-188-148.ngrok-free.app/generate/", data=payload, headers=headers) as response:
                print(f"Request to Colab completed with status {response.status}\n")

                if response.status == 200:
                    # Convert the image response to Base64
                    image_data = await response.read()
                    image_base64 = base64.b64encode(image_data).decode("utf-8")

                    response_body = {
                        "text": "",
                        "email": "AI",
                        "ImageBlob": image_base64,
                        "img": f"{os.environ.get('HostPath')}/media/AI.webp",
                    }
                    return {"type": "success", "result": response_body}

                else:
                    return {"type": "warning", "result": f"Failed to generate image: {response.status}"}

    except Exception as e:
        print(f"Error: {e}")
        return {"type": "warning", "result": "We're currently experiencing maintenance. Sorry for the inconvenience."}


@circuit
#@async_to_sync
async def RequestAIResponseFunc(prompt,email):
    """Generate AI content asynchronously."""
    try:
        model = settings.AI_MODEL
        response = await asyncio.to_thread(model.generate_content, prompt)  # Run sync function in async environment
        bodyval =  {
            'text': markdown(response.text),
            'email': 'AI',
            'img' : f'{os.environ.get('HostPath')}/media/AI.webp',
        }
        reponseval = {'type' : 'success','status' : 'success','result' : bodyval}
        return reponseval
    except Exception as e:
        print(e)
        reponseval = {'type' : 'error','status' : 'error','result' : 'invalid data'}
        return reponseval
    


class AIConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tasks = set()  # Keep track of running tasks


    async def connect(self):    
        self.emailConnected = self.scope['url_route']['kwargs']['email']
        await self.accept() 
        

    async def disconnect(self, close_code):  
        # Cancel all running tasks
        for task in self.tasks:
            task.cancel()
        try:
            await gather(*self.tasks, return_exceptions=True)  # Wait for task cancellations
        except CancelledError:
            pass  # Ignore cancellation errors
        finally:
            self.tasks.clear()
    async def send_msg(self, data,type,online = None):
        
        await self.send(
            text_data=json.dumps(
                {
                    'type' : type,
                    "message": data,
                }
            )
        )   

    async def receive(self, text_data=None,bytes_data=None):
        date = datetime.datetime.now()
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        if(message == 'RequestAIResponse'):
                email = sanitize_string(text_data_json['email'])
                prompt = sanitize_string(text_data_json['prompt'])     
                # Track the task
                task = asyncio.create_task(self.handle_request_ai_response(prompt, email))
                self.tasks.add(task)
                task.add_done_callback(self.tasks.discard)
                # val = await RequestAIResponseFunc(prompt=prompt,email=email)           
                # await self.send_msg(data=val,type='RequestAIResponse')
        elif (message == 'RequestAICarousels'):
                UserEmail = text_data_json['UserEmail']
                val = await RequestAICarouselsFunc(UserEmail=UserEmail)
                # Track the task
                task = asyncio.create_task(self.handle_request_ai_carousels(UserEmail))
                self.tasks.add(task)
                task.add_done_callback(self.tasks.discard)
                # await self.send_msg(data=val,type='RequestAICarousels')  
        elif (message == 'RequestTextToImageAI'):
                email = sanitize_string(text_data_json['Email'])
                if email != 'null' and email != 'gestuser@gmail.com' and email != '' :
                    prompt = sanitize_string(text_data_json['prompt'])
                    # Track the task
                    task = asyncio.create_task(self.handle_request_text_to_image_ai(prompt, email))
                    self.tasks.add(task)
                    task.add_done_callback(self.tasks.discard)
                    
                else:
                    val = {'status' : 'warning','message' : 'Create an account to use this AI'}
                    await self.send_msg(data=val,type='RequestTextToImageAI')    

    async def handle_request_ai_response(self, prompt, email):
        val = await RequestAIResponseFunc(prompt=prompt, email=email)
        await self.send_msg(data=val, type='RequestAIResponse')

    async def handle_request_ai_carousels(self, UserEmail):
        val = await RequestAICarouselsFunc(UserEmail=UserEmail)
        await self.send_msg(data=val, type='RequestAICarousels')
    
    async def handle_request_text_to_image_ai(self,prompt,email):
        
        val = await RequestTextToImageAIFunc(UserEmail=email,prompt=prompt)        
        await self.send_msg(data=val,type='RequestTextToImageAI')


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):        
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = f'chat_{self.room_name}'

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
         #comment the followig if your running redis on port 127.0.0.1:6379
       
        await self.accept()
        

    async def disconnect(self, close_code):
       
        # async_to_sync(self.channel_layer.group_discard)(
        #     self.room_group_name, self.channel_name
        # )
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)


    async def send_msg(self, msg):
        await self.send(
            text_data=json.dumps(
                {
                    "message": msg,
                }
            )
        )   

    #recieve message from websocket
    async def receive(self, text_data):
    
        date = datetime.datetime.now()
        text_data_json = json.loads(text_data)        
        scope = text_data_json['scope'] 
        if scope == 'Chats':          
            message = sanitize_string(text_data_json['message'])
            SenderId = sanitize_string(text_data_json['SenderId'])
            RecieverId = sanitize_string(text_data_json['RecieverId'])
            email = sanitize_string(text_data_json['email'])
            name = sanitize_string(text_data_json['name'])
            groopName = sanitize_string(text_data_json['group_name'])
            upload = sanitize_string( text_data_json['upload'])
            src = sanitize_string(text_data_json['src'])
            action = sanitize_string(text_data_json['action']) 
            inboxEmail = sanitize_string(text_data_json['inboxEmail'])
            delId = sanitize_string(text_data_json['delId']) 
            TopMessegeId = sanitize_string(text_data_json['TopMessegeId'])
            ReplyChat = sanitize_string(text_data_json['ReplyChat']) 
            ReplyChatName = sanitize_string(text_data_json['ReplyChatName']) 
            if email == 'gestuser@gmail.com' or email == '' or email == 'null':
                    val = {'status' : 'error','message': 'Sign up to manage chats'}
                    await self.channel_layer.group_send(
                            self.room_group_name, {'type' : 'chat.message','message' :val}
                    )
            else:
                val = await PrivateChatLog(ReplyChatName = ReplyChatName,TopMessegeId=TopMessegeId,inboxEmail =inboxEmail,ReplyChat = ReplyChat,delId = delId,action = action,upload = upload,name = name,email = email, src = src,RecieverId = RecieverId,Groupname=groopName,SenderId=SenderId,message=message)
                await self.channel_layer.group_send(
                    self.room_group_name, {'type' : 'chat.message','message' :val}
                    )
        if scope == 'Groups':            
            message = sanitize_string(text_data_json['message'])
            email = sanitize_string(text_data_json['email'])
            name = sanitize_string(text_data_json['sender'])
            groopName = sanitize_string(text_data_json['group_name'])
            upload = sanitize_string( text_data_json['upload'])
            src = sanitize_string(text_data_json['src'])      
            action = sanitize_string(text_data_json['action']) 
            delId = sanitize_string(text_data_json['delId'])          
            TopMessegeId = sanitize_string(text_data_json['TopMessegeId'])
            inboxId = sanitize_string(text_data_json['inboxId'])    
            ReplyChat = sanitize_string(text_data_json['ReplyChat']) 
            ReplyChatName = sanitize_string(text_data_json['ReplyChatName']) 
            if email == 'gestuser@gmail.com' or email == '' or email == 'null':
                    val = {'status' : 'error','message': 'Sign up to manage chats'}
                    await self.channel_layer.group_send(
                        self.room_group_name, {'type' : 'chat.message','message' :val}
                    )
            else:
                val = await GroupChatLogGroup(ReplyChatName = ReplyChatName,TopMessegeId=TopMessegeId,inboxId =inboxId,ReplyChat = ReplyChat,delId = delId,action = action,upload = upload, src = src,name = name,Groupname=groopName,email=email,message=message)

                await self.channel_layer.group_send(
                    self.room_group_name, {'type' : 'chat.message','message' :val}
                )
        if scope == 'Community':            
            message = sanitize_string(text_data_json['message'])
            email = sanitize_string(text_data_json['email'])
            name = sanitize_string(text_data_json['sender'])
            groopName = sanitize_string(text_data_json['group_name'])
            upload = sanitize_string( text_data_json['upload'])
            src = sanitize_string(text_data_json['src'])      
            inboxId = sanitize_string(text_data_json['inboxId'])
            TopMessegeId = sanitize_string(text_data_json['TopMessegeId'])
            action = sanitize_string(text_data_json['action']) 
            delId = sanitize_string(text_data_json['delId'])            
            ReplyChat = sanitize_string(text_data_json['ReplyChat']) 
            ReplyChatName = sanitize_string(text_data_json['ReplyChatName']) 
            if email == 'gestuser@gmail.com' or email == '' or email == 'null':
                    val = {'status' : 'error','message': 'Sign up to manage chats'}
                    await self.channel_layer.group_send(
                    self.room_group_name, {'type' : 'chat.message','message' :val}
                    )
            else:
                val = await CommunityChatLogGroup(ReplyChatName = ReplyChatName,TopMessegeId=TopMessegeId,inboxId =inboxId,ReplyChat = ReplyChat,delId = delId,action = action,upload = upload, src = src,name = name,Groupname=groopName,email=email,message=message)

                await self.channel_layer.group_send(
                    self.room_group_name, {'type' : 'chat.message','message' :val}
                )
        
   
    #recieve message from room group
    async def chat_message(self, event):
        message = event['message']
        await self.send_msg(msg=message)
    

class ChatList(AsyncWebsocketConsumer):


    async def connect(self):    
        self.emailConnected = self.scope['url_route']['kwargs']['email']
        await self.accept() 
        

    async def disconnect(self, close_code):  
        if self.emailConnected != 'gestuser@gmail.com' or self.emailConnected != '' or self.emailConnected != 'null': 
            await ToogleOnline('AddLastSeen',email=self.emailConnected)
            print('disconnecting user: ',self.emailConnected)  
        pass


    async def send_msg(self, data,type,online = None):
        
        await self.send(
            text_data=json.dumps(
                {
                    'type' : type,
                    "message": data,
                    'Ioss13_32kjb' : online #for online data
                }
            )
        )   

    #recieve message from websocket
    async def receive(self, text_data=None,bytes_data=None):
        file_name = ''
        date = datetime.datetime.now()
        #return
        if isinstance(bytes_data,bytes):         
            
            file_buffer =bytes_data
            #file_name = 'loginPreview.png'  # Replace with a unique file name
            if default_storage.exists(file_name):
                pass
                # Duplicate found, handle it (e.g., raise an error, rename the file)
            else:
                with default_storage.open(file_name, 'wb') as f:
                    f.write(file_buffer)
            # Handle the uploaded file as needed
            
            await self.send_msg(data='Success',type='Upload')
        else:
            text_data_json = json.loads(text_data)
            message = text_data_json['message']
            if(message == 'EditProfile'):
                email = sanitize_string(text_data_json['email'])
                if email != 'null' and email != 'gestuser@gmail.com' and email != '' :
                    name = sanitize_string(text_data_json['name'])
                    #ProfilePic = sanitize_string(text_data_json['ProfilePic'])
                    about = sanitize_string(text_data_json['about'])     
                    val = await EditProfileFunc(about=about,name=name,email=email)           
       
                    await self.send_msg(data=val,type='EditProfile')
                else:
                    val = {'status' : 'error','message' : 'invalid account'}
                    await self.send_msg(data=val,type='EditProfile')
            elif(message == 'NotePadlogs'):
                email = sanitize_string(text_data_json['email'])
                if email != 'null' and email != 'gestuser@gmail.com' and email != '' :
                    val = await NotePadlogs(email=email)            
                    await self.send_msg(data=val,type='NotePadlogs')
                else:
                    val = {'status' : 'error','message' : 'invalid account'}
                    await self.send_msg(data=val,type='NotePadlogs')
            elif(message == 'NotePadlogsDelete'):
                email = sanitize_string(text_data_json['email'])
                title = sanitize_string(text_data_json['title'])
                if email != 'null' and email != 'gestuser@gmail.com' and email != '' and title != 'null' :
                    val = await NotePadlogsDelete(email=email, title = title)            
                    await self.send_msg(data=val,type='NotePadlogsDelete')
                else:
                    val = {'status' : 'error','message' : 'invalid account'}
                    await self.send_msg(data=val,type='NotePadlogsDelete')
            elif(message == 'SubmitNoteChat'):
                email = sanitize_string(text_data_json['email'])
                title = sanitize_string(text_data_json['title'])
                text = sanitize_string(text_data_json['text'])
                if email == 'null' and email == 'gestuser@gmail.com' and email == '' and text == '' :
                    val = {'status' : 'error','message' : 'invalid account or data'}           
                    await self.send_msg(data=val,type='SubmitNoteChat')
                else:
                    val = await SubmitNoteFunc(email = email, title = title,text=text)
                    await self.send_msg(data=val,type='SubmitNoteChat')
            elif(message == 'AddNote'):
                email = sanitize_string(text_data_json['email'])
                title = sanitize_string(text_data_json['title'])
                if email == 'null' and email == 'gestuser@gmail.com' and email == '' :
                    val = {'status' : 'error','message' : 'invalid account'}           
                    await self.send_msg(data=val,type='AddNote')
                else:
                    val = await AddNoteFunc(title= title, email = email)
                    await self.send_msg(data=val,type='AddNote')
            elif(message == 'Groups'):
                email = sanitize_string(text_data_json['email'])
                val = await GroupListFunc(emailval=email)            
                await self.send_msg(data=val,type='Groups')
            elif(message == 'Chats'):
                RecieverId = sanitize_string(text_data_json['RecieverId'])        
                emailval = sanitize_string(text_data_json['email'])
                onlineStatusData = []
                if emailval != 'null' and emailval != 'gestuser@gmail.com' and emailval != '':
                    onlineStatusData = await ToogleOnline(props='AddOnline',email=emailval)
                
                val = await ChatListFunc(RecieverId)
                await self.send_msg(data=val,type='Chats',online=onlineStatusData)
            elif (message == 'Offline'):
                emailval = sanitize_string(text_data_json['email'])
                if emailval != 'null' and emailval != 'gestuser@gmail.com' and emailval != '':
                    onlineStatusData = await ToogleOnline(props='AddOnline',email=emailval)                
                    val = {'status' : 'offline'}
                    await self.send_msg(data=val,type='Offline',online=onlineStatusData)
                else:                
                    val = {'status' : 'offline'}
                    await self.send_msg(data=val,type='Offline',online=[])
            elif(message == 'Community'):
                IsContinue = sanitize_string(text_data_json['IsContinue'])
                SearchUser = sanitize_string(text_data_json['SearchUser'])
                ContinuetionId = sanitize_string(text_data_json['ContinuetionId'])
                val = await CommunityListFunc(ContinuetionId=ContinuetionId,IsContinue=IsContinue,SearchUserval=SearchUser)
                await self.send_msg(data=val,type='Community')
            elif(message == 'AllChatLog'):
                scope = text_data_json['scope']
                
                if(scope == 'Chats'):
                    RecieverId = sanitize_string(text_data_json['RecieverId'])
                    SenderId = sanitize_string(text_data_json['SenderId'])          
                    val = await ChatLogsFunc(RecieverId,SenderId)
                    await self.send_msg(data=val,type='AllChatLogChats') 
                elif(scope == 'Groups'):
                    roomName = sanitize_string(text_data_json['roomName'])
                    val = await GroupLogsFunc(roomName)
                    await self.send_msg(data=val,type='AllChatLog')
                elif(scope == 'Community'):
                    roomName = sanitize_string(text_data_json['roomName'])
                    val = await CommunityLogsFunc(roomName)          
                    await self.send_msg(data=val,type='AllChatLog')
            elif (message == 'RequestMoreChatsLog'):
                data = text_data_json['data']
                scope = sanitize_string(text_data_json['scope'])
                val = await RequestMoreChatsLogFunc(data=data,scope=scope)
                await self.send_msg(data=val,type='RequestMoreChatsLog')     
            elif (message == 'RequestDeleteInbox'):
                data = text_data_json['data']
                val = await RequestDeleteInboxFunc(data=data)
                await self.send_msg(data=val,type='RequestDeleteInbox') 
            elif(message == 'Suggestions'):
                SearchUser = sanitize_string(text_data_json['SearchUser'])
                RecieverId = sanitize_string(text_data_json['RecieverId'])
                IsContinue = sanitize_string(text_data_json['IsContinue'])
                ContinuetionId = sanitize_string(text_data_json['ContinuetionId'])
                emailval = sanitize_string(text_data_json['email'])
                onlineStatusData = []
                if emailval == 'gestuser@gmail.com' or emailval == 'null' or emailval == '' or RecieverId == 'null':
                    val = {'status' : 'error','message': 'Sign up to manage chats'}
                    await self.send_msg(data=val,type='Suggestions',online=[])
                else:
                    val =  await SuggestionsLogsFunc(SearchUserval = SearchUser,RecieverIdval = RecieverId,IsContinue=IsContinue,ContinuetionId=ContinuetionId)
                    await self.send_msg(data=val,type='Suggestions',online=[])

                #fettch all the data log either chat or group in the db then return it
            elif(message == 'SuggestionsGroups'):
                SearchUser = sanitize_string(text_data_json['SearchUser'])
                IsContinue = sanitize_string(text_data_json['IsContinue'])
                ContinuetionId = sanitize_string(text_data_json['ContinuetionId'])
                emailval = sanitize_string(text_data_json['email'])
                onlineStatusData = []
                if emailval == 'gestuser@gmail.com' or emailval == 'null' or emailval == '' or SearchUser == '':
                    val = {'status' : 'error','message': 'Sign up to manage chats'}
                    await self.send_msg(data=val,type='SuggestionsGroups',online=[])
                else:
                    val =  await SuggestionsGroupsLogsFunc(SearchUserval = SearchUser,IsContinue=IsContinue,ContinuetionId=ContinuetionId)
                    await self.send_msg(data=val,type='SuggestionsGroups',online=[])

            elif (message == 'JoinRequest'):
                email = sanitize_string(text_data_json['email'])
                name = sanitize_string(text_data_json['name'])
                id = sanitize_string(text_data_json['id'])
                roomName = sanitize_string(text_data_json['roomName'])
                GroupName = sanitize_string(text_data_json['GroupName'])
                profilePic = sanitize_string(text_data_json['profilePic'])
                if email == 'gestuser@gmail.com' or email == 'null' or email == '':
                    val = {'status' : 'error','message': 'Sign up to manage chats'}
                    await self.send_msg(data= val, type='JoinRequest')
                else:
                    val = await JoinRequest(profilePic = profilePic,name = name, room_name = roomName, email = email, id = id,groupname=GroupName)
                    await self.send_msg(data= val, type='JoinRequest')
            elif(message == 'UpdateRequest'):
                name = sanitize_string(text_data_json['name'])
                email = sanitize_string(text_data_json['email'])
                roomName = sanitize_string(text_data_json['roomName'])
                choice = sanitize_string(text_data_json['choice'])
                id = sanitize_string(text_data_json['id'])
                if email == 'gestuser@gmail.com' or email == 'null' or email == '':
                    val = {'status' : 'error','message': 'Sign up to manage chats'}
                    await self.send_msg(data= val, type='UpdateRequest')
                else:
                    val = await UpdateRequest(id = id,choice = choice,name=name, room_name = roomName, email = email)
                    await self.send_msg(data= val, type='UpdateRequest')
            elif(message == 'GetRequestMade'):
                id = sanitize_string(text_data_json['id'])
                val = await GetRequestMade( id = id)
                await self.send_msg(data= val, type='GetRequestMade')
            elif(message == 'RequestsList'):
                email = sanitize_string(text_data_json['email'])
                if email == 'gestuser@gmail.com' or email == 'null' or email == '':
                    val = {'status' : 'error','message': 'Sign up to manage chats'}
                    await self.send_msg(data=val,type='RequestsList')
                else:
                    val = await RequestsList(email = email)
                    await self.send_msg(data=val,type='RequestsList')
            elif(message == 'RemoveRequest'):
                id = sanitize_string(text_data_json['id'])
                emailval = sanitize_string(text_data_json['userEmail'])
                roomName = sanitize_string(text_data_json['roomName'])
                if emailval == 'gestuser@gmail.com' and emailval == 'null' and emailval == '':
                    val = {'status' : 'error','message': 'Sign up to manage chats'}
                    await self.send_msg(data= val, type='RemoveRequest')
                else:
                    val = await RemoveRequest(room_name = roomName, id = id)
                    await self.send_msg(data= val, type='RemoveRequest')
            elif(message == 'CreateFriend'):
                RecieverId = sanitize_string(text_data_json['RecieverId'])  
                SenderId = sanitize_string(text_data_json['SenderId']) 
                detailval = text_data_json['detailval']  
                val = await  CreateFriend(SenderId = SenderId,RecieverId =RecieverId,detailval = detailval)
                await self.send_msg(data= val, type='CreateFriend')
            elif(message == 'StartNewChat'):
                RecieverId = sanitize_string(text_data_json['RecieverId'])
                SenderId = sanitize_string(text_data_json['SenderId'])  
                email = sanitize_string(text_data_json['email'])
                group_name = sanitize_string(text_data_json['group_name'])
                Details = text_data_json['Details']
                val = await StartNewChatFunc(email=email,Details=Details,RecieverId = RecieverId,SenderId = SenderId,group_name = group_name)
                await self.send_msg(data=val,type='StartNewChat') 
            elif (message == 'RequestProfilePosts'):
                emailval = sanitize_string(text_data_json['email'])
                postPosition = sanitize_string(text_data_json['position'])
                IsOwner = sanitize_string(text_data_json['IsOwner'])
                AccountID = sanitize_string(text_data_json['AccountID'])
                continuetion = sanitize_string(text_data_json['continuetion'])
                #emailval == 'gestuser@gmail.com' or emailval == 'null' or emailval == '' or 
                if AccountID == '':
                    val = {'status' : 'error','message': 'Sign up to manage profile'}
                    await self.send_msg(data=val,type='RequestProfilePosts') 
                else:
                    val = await RequestProfilePostsFunc(id = AccountID,IsOwner=IsOwner,email=emailval,Position = postPosition,continuetion=continuetion)
                    await self.send_msg(data=val,type='RequestProfilePosts') 
            elif (message == 'RequestProfileComments'):
                postPosition = sanitize_string(text_data_json['position'])
                continuetionId = sanitize_string(text_data_json['continuetionId'])
                continuetion = sanitize_string(text_data_json['continuetion'])
                val = await RequestProfileCommentsFunc(Position = postPosition,continuetion = continuetion,continuetionId = continuetionId)
                await self.send_msg(data=val,type='RequestProfileComments')  
            elif (message == 'SendPostComment'):
                data = text_data_json['data']
                val = await SendPostCommentFunc(data = data)
                await self.send_msg(data=val,type='SendPostComment')   
            elif (message == 'RequestDeleteComment'):
                data = text_data_json['data']
                val = await RequestDeleteCommentFunc(data = data)
                await self.send_msg(data=val,type='RequestDeleteComment')  
            elif (message == 'RequestLikePost'):
                data = text_data_json['data']
                val = await RequestLikePostFunc(data = data)
                await self.send_msg(data=val,type='RequestLikePost')    
            elif (message == 'RequestPosts'):
                emailval = sanitize_string(text_data_json['email'])
                postPosition = sanitize_string(text_data_json['position'])
                continuetion = sanitize_string(text_data_json['continuetion'])
                direction = sanitize_string(text_data_json['direction'])
                val = await RequestPostsFunc(email=emailval,Position = postPosition,direction=direction,continuetion=continuetion)
                await self.send_msg(data=val,type='RequestPosts')
            elif (message == 'MakePostPublic'):
                data = text_data_json['data']
                val = await MakePostPublicFunc(data=data)
                await self.send_msg(data=val,type='MakePostPublic') 
            elif (message == 'MakePostPrivate'):
                data = text_data_json['data']
                val = await MakePostPrivateFunc(data=data)
                await self.send_msg(data=val,type='MakePostPrivate') 
            elif (message == 'RequestSavePost'):
                data = text_data_json['data']
                val = await RequestSavePostFunc(data=data)
                await self.send_msg(data=val,type='RequestSavePost') 
            elif (message == 'RequestSavedPost'):
                emailval = sanitize_string(text_data_json['AccountEmail'])
                val = await RequestSavedPostFunc(email=emailval)
                await self.send_msg(data=val,type='RequestSavedPost') 
            elif (message == 'DeleteSavedPost'):
                data = text_data_json['data']
                val = await DeleteSavedPostFunc(data=data)
                await self.send_msg(data=val,type='DeleteSavedPost')
            elif (message == 'RequestFolderData'):
                emailval = sanitize_string(text_data_json['AccountEmail'])
                val = await RequestFolderDataFunc(email=emailval)
                await self.send_msg(data=val,type='RequestFolderData')
            elif (message == 'RequestAddFolder'):
                emailval = sanitize_string(text_data_json['AccountEmail'])
                folderName = sanitize_string(text_data_json['folderName'])
                val = await RequestAddFolderFunc(email=emailval,foldername = folderName)
                await self.send_msg(data=val,type='RequestAddFolder')  
            elif (message == 'RequestFolderFiles'):
                emailval = sanitize_string(text_data_json['AccountEmail'])
                folderId = sanitize_string(text_data_json['folderId'])
                val = await RequestFolderFilesFunc(email=emailval,folderId = folderId)
                await self.send_msg(data=val,type='RequestFolderFiles')
            elif (message == 'RequestDeleteFolder'):
                emailval = sanitize_string(text_data_json['AccountEmail'])
                folderId = sanitize_string(text_data_json['folderId'])
                val = await RequestDeleteFolderFunc(email=emailval,folderId = folderId)
                await self.send_msg(data=val,type='RequestDeleteFolder')
            elif (message == 'RequestEditfolderName'):
                dataval = text_data_json['data']
                val = await RequestEditfolderNameFunc(data=dataval)
                await self.send_msg(data=val,type='RequestEditfolderName')
            elif (message == 'RequestDeleteRepositoryFile'):
                data = text_data_json['data']
                val = await RequestDeleteRepositoryFileFunc(data=data)
                await self.send_msg(data=val,type='RequestDeleteRepositoryFile') 
            elif (message == 'RequestProfileNetwork'):
                AccountID = text_data_json['AccountID']
                UserEmail = text_data_json['UserEmail']
                scope = sanitize_string(text_data_json['scope'])
                AccountID = sanitize_string(text_data_json['AccountID'])
                continuetionId = sanitize_string(text_data_json['continuetionId'])
                continuetion = sanitize_string(text_data_json['continuetion'])
                val = await RequestProfileNetworkFunc(UserEmail=UserEmail,AccountID = AccountID,scope = scope,continuetionId = continuetionId,continuetion=continuetion)
                await self.send_msg(data=val,type='RequestProfileNetwork') 
            
            
   

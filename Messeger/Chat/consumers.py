# chat/consumers.py
import json,threading,datetime
from django.core.files.storage import FileSystemStorage
import time,os
from django.conf import settings, Settings
from asgiref.sync import sync_to_async,async_to_sync
from channels.generic.websocket import WebsocketConsumer,AsyncWebsocketConsumer
from django.core.exceptions import ValidationError
from .models import Account,GroupChat,PersonalChats,RequestJobTable,OnlineStatus, JobsTable,CommunityChat,RequestTable,NotePad
from channels.db import database_sync_to_async
from django.core.files.storage import default_storage
from django.db.models import Q
from .models import sanitize_string
from circuitbreaker import circuit

#from ..Messeger.settings import redisConnection

@circuit
@database_sync_to_async
def GroupListFunc():       
        val =  list(GroupChat.objects.all().values())      
        return val

@circuit
@database_sync_to_async
def CommunityListFunc():       
        val =  list(CommunityChat.objects.all().values())      
        return val


@circuit
@database_sync_to_async
def ChatLogsFunc(RecieverId,SenderId):   
    if(SenderId != 'null' and RecieverId != 'null'):
        val =  list(PersonalChats.objects.all().values().filter( Q(SenderId = SenderId,RecieverId = RecieverId) | Q(RecieverId = SenderId,SenderId = RecieverId) )) 

        return val
    else:
        return []


@circuit
@database_sync_to_async
def GroupLogsFunc(props):       
        val =  list(GroupChat.objects.all().values().filter(group_name = props)) 
        return val


@circuit
@database_sync_to_async
def CommunityLogsFunc(props):       
        val =  list(CommunityChat.objects.all().values().filter(group_name = props)) 
        return val


@circuit
@database_sync_to_async
def ChatListFunc(RecieverId):       
    val = list(PersonalChats.objects.filter( (Q(SenderId = RecieverId) | Q(RecieverId = RecieverId)) & (~Q(SenderId='') & ~Q(RecieverId=''))  ).values())
    return val


@circuit
@database_sync_to_async
def GroupChatLogGroup(delEmail,ReplyChat,ReplyChatName,Groupname,name,message,email,src,upload,action=None,Deltime = None):
    Group = GroupChat
    now = datetime.datetime.now()
    short_date = now.strftime("%Y-%m-%d")
    data =  list(GroupChat.objects.all().values().filter(group_name = Groupname))
    if(data[0]):
        chat = data[0]['ChatLogs']
        if(chat != None):
            if action != None and action == 'delete from all':
                for i, d in enumerate(chat):
                    if d['time'] == Deltime and d['name'] == name and d['email'] == email and d['text'] == message:
                        #x = chat[i]['DelList'] if chat[i]['DelList'] else [] 
                        chat[i] = {
                            "name" : name,
                            "text" : 'This message was deleted!',
                            "time" : str(short_date),
                            "email" :email,
                            "Status" : 'deleted',
                            "src" : 'null',
                            'upload' : '',
                            'action' : 'deleted from all',
                            'DelList' : [0],
                            'ReplyChatName' : '',
                            'ReplyChat' : ''
                        }
                        break
            elif action !=None and action == 'delete from me':
                for i, d in enumerate(chat):
                    if d['time'] == Deltime and d['name'] == name and d['email'] == email and d['text'] == message:
                        x = chat[i]['DelList'] 
                        x.append(delEmail)          
                        ReplyChatval = chat[i]['ReplyChat'] if chat[i]['ReplyChat'] else '' 
                        srcval = chat[i]['src'] if chat[i]['src'] else 'null' 
                        uploadval = chat[i]['upload'] if chat[i]['upload'] else ''
                        
                        chat[i] = {
                            "name" : name,
                            "text" : message,
                            "time" : str(short_date),
                            "email" :  email,
                            "Status" : 'deleted',
                            "src" : srcval,
                            'upload' : uploadval,
                            'action' : 'deleted from me',
                            'DelList' : x,
                            'ReplyChatName' : ReplyChatval,
                            'ReplyChat' : ReplyChatval
                        }
                        break
            else:
                chat.append({
                    "name" : name,
                    "text" : message,
                    "time" : str(short_date),
                    "email" :email,
                    "Status" : 'send',
                    "src" : src,
                    'upload' : upload,
                    'action' : '',
                    'DelList' : [0],
                    'ReplyChatName' : ReplyChatName,
                    'ReplyChat' : ReplyChat
                })
        else:
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
                'ReplyChat' : ''
            }]
        x = GroupChat.objects.all().values().filter(group_name = Groupname)
        x.update(ChatLogs = chat)

        GroupChat.save 
        return chat
    else:
         return ''
    

@circuit
@database_sync_to_async
def CommunityChatLogGroup(delEmail,ReplyChat,ReplyChatName,Groupname,name,message,email,src,upload,action=None,Deltime = None):
    Group = CommunityChat
    now = datetime.datetime.now()
    short_date = now.strftime("%Y-%m-%d")
    data =  list(CommunityChat.objects.all().values().filter(group_name = Groupname))
    if(data[0]):
        chat = data[0]['ChatLogs']
        if(chat != None):
            if action != None and action == 'delete from all':
                for i, d in enumerate(chat):
                    if d['time'] == Deltime and d['name'] == name and d['email'] == email and d['text'] == message:
                        #x = chat[i]['DelList'] if chat[i]['DelList'] else [] 
                        chat[i] = {
                            "name" : name,
                            "text" : 'This message was deleted!',
                            "time" : str(short_date),
                            "email" :email,
                            "Status" : 'deleted',
                            "src" : 'null',
                            'upload' : '',
                            'action' : 'deleted from all',
                            'DelList' : [0],
                            'ReplyChatName' : '',
                            'ReplyChat' : ''
                        }
                        break
            elif action !=None and action == 'delete from me':
                for i, d in enumerate(chat):
                    if d['time'] == Deltime and d['name'] == name and d['email'] == email and d['text'] == message:
                        x = chat[i]['DelList'] 
                        x.append(delEmail)                        
                        ReplyChatval = chat[i]['ReplyChat'] if chat[i]['ReplyChat'] else '' 
                        srcval = chat[i]['src'] if chat[i]['src'] else 'null' 
                        uploadval = chat[i]['upload'] if chat[i]['upload'] else ''
                        
                        chat[i] = {
                            "name" : name,
                            "text" : message,
                            "time" : str(short_date),
                            "email" :  email,
                            "Status" : 'deleted',
                            "src" : srcval,
                            'upload' : uploadval,
                            'action' : 'deleted from me',
                            'DelList' : x,
                            'ReplyChatName' : ReplyChatval,
                            'ReplyChat' : ReplyChatval
                        }
                        break
            else:
                chat.append({
                    "name" : name,
                    "text" : message,
                    "time" : str(short_date),
                    "email" :email,
                    "Status" : 'send',
                    "src" : src,
                    'upload' : upload,
                    'action' : '',
                    'DelList' : [0],
                    'ReplyChatName' : ReplyChatName,
                    'ReplyChat' : ReplyChat
                })
        else:
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
                'ReplyChat' : ''
            }]
        x = CommunityChat.objects.all().values().filter(group_name = Groupname)
        x.update(ChatLogs = chat)

        CommunityChat.save 
        return chat
    else:
         return ''


@circuit
@database_sync_to_async
def PrivateChatLog(delEmail,ReplyChatName,ReplyChat,Groupname,email,name,RecieverId,SenderId,message,src,upload,action=None,Deltime = None):
    Chat = PersonalChats
    now = datetime.datetime.now()
    short_date = now.strftime("%I:%M:%S %p")
    data =  list(PersonalChats.objects.all().values().filter(RecieverId = RecieverId,SenderId = SenderId))
    if(data[0]):
        chat = data[0]['ChatLog']
        if(chat != None):
            if action != None and action == 'delete from all':
                for i, d in enumerate(chat):
                    if d['time'] == Deltime and d['name'] == name and d['email'] == email and d['text'] == message:
                        #x = chat[i]['DelList'] if chat[i]['DelList'] else []
                        chat[i] = {
                            "name" : name,
                            "text" : 'This message was deleted!',
                            "time" : str(short_date),
                            "email" :email,
                            "Status" : 'deleted',
                            "src" : 'null',
                            'upload' : '',
                            'action' : 'deleted from all',
                            'DelList' : [0],
                            'ReplyChatName' : '',
                            'ReplyChat' : ''
                        }
                        break
            elif action !=None and action == 'delete from me':
                for i, d in enumerate(chat):
                    if d['time'] == Deltime and d['name'] == name and d['email'] == email and d['text'] == message:
                        x = chat[i]['DelList'] 
                        x.append(delEmail)                        
                        ReplyChatval = chat[i]['ReplyChat'] if chat[i]['ReplyChat'] else '' 
                        
                        srcval = chat[i]['src'] if chat[i]['src'] else 'null' 
                        uploadval = chat[i]['upload'] if chat[i]['upload'] else ''
                        
                        chat[i] = {
                            "name" : name,
                            "text" : 'This message was deleted!' if len(x) >= 3 else message,
                            "time" : str(short_date),
                            "email" :  email,
                            "Status" : 'deleted',
                            "src" : srcval,
                            'upload' : uploadval,
                            'action' : 'deleted from all' if len(x) >= 3 else 'deleted from me',
                            'DelList' : x,
                            'ReplyChatName' : ReplyChatval,
                            'ReplyChat' : ReplyChatval
                        }
                        break
            else:
                chat.append({
                    "name" : name,
                    "text" : message,
                    "time" : str(short_date),
                    "email" :email,
                    "Status" : 'send',
                    "src" : src,
                    'upload' : upload,
                    'action' : '',
                    'DelList' : [0],
                    'ReplyChatName' : ReplyChatName,
                    'ReplyChat' : ReplyChat
                })
        else:
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
                'ReplyChat' : ''
            }]
        x = PersonalChats.objects.all().values().filter(RecieverId = RecieverId,SenderId = SenderId)
        x.update(ChatLog = chat)

        PersonalChats.save 
        return chat
    else:
         return ''


@circuit
@database_sync_to_async
def RemoveRequest( id, room_name,scope = None):
    RequestTable.objects.filter(RoomName = room_name,UserId = id).delete()
    return {'status' : 'success','message': 'Request Removed'}

@circuit
@database_sync_to_async
def JoinRequest (email,about, id, room_name,profilePic,scope = None,groupname = None):
    creator = list(GroupChat.objects.all().values().filter(group_name = room_name))
    CreatorEmail = creator[0]['Creator']
    groupnameval = str(groupname)
    data =  list(RequestTable.objects.all().values().filter(UserId = id,RoomName =room_name))
    
    if(len(data) != 0 and email != 'null'):
        if(data[0]['status'] != 'Banned' and data[0]['status'] != 'Reject' and data[0]['status'] != 'Accepted'):
            RequestTable.objects.filter(RoomName = room_name,id = id).delete()

            user = [{
                'about' : about,
                'email' : email,
                'UserPic' : profilePic
            }]
            RequestTable.objects.create(UserId = id,RoomName = room_name,UserDetails = user,Creator = CreatorEmail,groupname =groupnameval  )
            RequestTable.save
        else:
            msg = data[0]['status'] 
            return {'status' : 'warning','message': f'{msg} by Owner'}
    else:
            user = [{
                'about' : about,
                'email' : email,
                'UserPic' : profilePic
            }]
            RequestTable.objects.create(UserId = id,RoomName = room_name,UserDetails = user,Creator = CreatorEmail,groupname =groupnameval )
            RequestTable.save
            return {'status' : 'success','message': 'Request made successfuly'}

@circuit
@database_sync_to_async
def UpdateRequest (email, room_name,choice,id):
          
    data =  GroupChat.objects.all().values().filter(group_name = room_name)
    if(data):
        x = RequestTable.objects.all().values().filter(RoomName = room_name,id = id)     
        if(choice == 'Accept'):
            #x.update(status = 'True')
            
            RequestTable.objects.filter(RoomName = room_name,id = id).delete()
            
            db = list(data)       
            val = db[0]['UsersList']
            if(val != None and email not in val ):
                    val.append(email)
            else:
                val = [email]
            data.update(UsersList = val)
            GroupChat.save
        else:
            x.update(status = choice)
            #data['UsersList'].append(email)
            #RequestTable.save
        return {'status' : 'success','message': 'Request Updated'}
    else:
        return {'status' : 'error','message': 'No such group'}

@circuit
@database_sync_to_async
def GetRequestMade( id):             
    data =  list(RequestTable.objects.all().values().filter(UserId = id))
    return data


@circuit
@database_sync_to_async
def RequestsList (email):
    data =  list(RequestTable.objects.all().values().filter(Creator = email))
    return data

@circuit
@database_sync_to_async
def CreateFriend(SenderId,RecieverId,detailval):
    if(SenderId != 'null' and RecieverId != 'null'):
            exist = list(PersonalChats.objects.all().filter(Q(SenderId = SenderId,RecieverId = RecieverId) | Q(RecieverId = SenderId,SenderId = RecieverId) ))
            if(len(exist) == 0):
                room = detailval[0]
                now = datetime.datetime.now()
                short_date = now.strftime("%Y-%m-%d")
                
                x = PersonalChats.objects.all().create(group_name = room,RecieverId = RecieverId,SenderId = SenderId,DateCreated = str(short_date),ChatLog = [],Details = detailval[1])
                x.save
                return {'status' : 'success','message': 'User added to your Chats'}
            else :
                return {'status' : 'warning','message': 'User exists in your Chats'}
    else:
        return {'status' : 'error','message': 'Invalid Inputs'}


##chats personal private
@circuit
@database_sync_to_async
def SuggestionsLogsFunc(RecieverIdval):
    data = list(PersonalChats.objects.filter(Q(RecieverId='') & ~Q(SenderId=RecieverIdval) ).values())    
    return data

@circuit
@database_sync_to_async
def NotePadlogs(email):
    val = list(NotePad.objects.all().filter(email = email).values())
    return val


@circuit
@database_sync_to_async
def AddNoteFunc(email,title):
    now = datetime.datetime.now()
    short_date = now.strftime("%Y-%m-%d")
    try:
        x = NotePad.objects.create(
        email = str(email),
        DateCreated = str(short_date),
        title = str(title)    
        )
        x.save
    except Exception as e:
        return {'status' : 'warning','message': f'Request Removed, duplicate title'}

    
    val = list(NotePad.objects.all().filter(email = email).values())
    return val

@circuit
@database_sync_to_async
def SubmitNoteFunc (email,text,title):
    data = list(NotePad.objects.all().filter(email = email,title = title).values())
    if(len(data) != 0 and email != 'null'):
        now = datetime.datetime.now()
        short_date = now.strftime("%Y-%m-%d")
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
def EditProfileFunc(about,email,name,ProfilePic):
    x = Account.objects.all().filter(email = email)
    #picval = f'http://127.0.0.1:8000/media/{ProfilePic}'

    
    if ProfilePic != 'null':
        x.update(name = name,about=about,ProfilePic = ProfilePic)
    else:
        x.update(name = name,about=about)
    Account.save

    responseval =  {'status' : 'success','message' : 'Profile Updated'}

    return responseval

@circuit
@database_sync_to_async
def PostJobFunc(CreatorsID,email,location,OpenedDate,Details,imageName):
    if location != '' and OpenedDate != '' and Details != '' and email != 'null':
       imageName = sanitize_string(imageName)
       Details['img'] = imageName
       email = sanitize_string(email)
       location = sanitize_string(location)
       OpenedDate = sanitize_string(OpenedDate)
       Details['requests'] = 0
       x = JobsTable.objects.create(CreatorsID =CreatorsID,email = email,location = location,OpenedDate =OpenedDate,Details = Details)
       JobsTable.save
       RequestJobTable.objects.create(email = email,JobID = x.id,Details = Details)
       responseval =  {'status' : 'success','message' : 'Job Posted Successfuly'}
    else:
       responseval =  {'status' : 'error','message' : 'Invalid Data'}

    return responseval

@circuit
@database_sync_to_async
def FindJobsFunc(location,OpenedDate):
    if location != '' and OpenedDate != '' and OpenedDate != '':
        data = list(JobsTable.objects.filter(Q(OpenedDate=OpenedDate) | Q(location=location) ).values())    
        return data
    else:
        data = list(JobsTable.objects.all().values())    

        #responseval =  {'status' : 'error','message' : 'Invalid Data'}
        return data

@circuit
@database_sync_to_async
def RequestJobFunc(details):
    if details['chatID'] != '' and details['name'] != '' and details['JobId'] != '' :
        id = sanitize_string(details['JobId'])
        data = JobsTable.objects.filter(id = id)
        if not data:
            responseval =  {'status' : 'warning','message' : 'Job not found or was deleted.'}
            return responseval
        listdata = list(data.values())
        if listdata[0]['RequestIDs'] != None:
            x = listdata[0]['RequestIDs']
            if details['chatID'] in x: 
                responseval =  {'status' : 'warning','message' : 'Job Request Exists.'}
                return responseval
            else:
                x.append(details['chatID'])
            
            data.update(RequestIDs = x)   
        else:
            data.update(RequestIDs = [details['chatID']]) 
        
        newRequest = {
            'name' : details['name'],
            'chatID' : details['chatID'],
            'MoreDetails' : details['MoreDetails'],
            'UploadedFileName' : details['UploadedFileName']
        }
        requestList = listdata[0]['Request']
        if requestList != None:
            requestList.append(newRequest)
            data.update(Request = requestList)   
        else:
            data.update(Request = [newRequest])  
        JobsTable.save
        
        RequestJobTable.objects.create(Details = listdata[0]['Details'],userID = details['chatID'], JobID = id)
        RequestJobTable.save
        responseval =  {'status' : 'success','message' : 'Job Request Successfuly Uploaded'}
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data'}
    
    return responseval

@circuit
@database_sync_to_async
def DeleteJobFunc(idval,email):
    if idval != '' and idval != 'null' and email != '' and email != 'null':
        id = sanitize_string(idval)
        JobsTable.objects.filter(id = id, email = email).delete()
        RequestJobTable.objects.filter(JobID = id).delete()
        responseval =  {'status' : 'success','message' : 'Job deleted Successfuly'}
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data or Job was already deleted.'}
    return responseval

@circuit
@database_sync_to_async
def MyJobsFunc (userID,email):
    if userID != '' and userID != 'null' and email != '' and email != 'null':
        id = sanitize_string(userID)
        emailval = sanitize_string(email)
        val = list(RequestJobTable.objects.filter(Q(email = emailval) | Q(userID = id)).values())
        return val
    else:
        return []
    
@circuit
@database_sync_to_async
def ReadMoreFunc (email,JobID):
    if JobID != '' and JobID != 'null' and email != '' and email != 'null':
        email = sanitize_string(email)
        idval = sanitize_string(JobID)
        data = list(JobsTable.objects.filter(id = idval).values())  
        return data
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data or Job was already deleted.'}
        return responseval
    
@circuit
@database_sync_to_async
def WithdrawRequestFunc (userID,JobID):
    if JobID != '' and JobID != 'null' and userID != '' and userID != 'null':
        userIDval = int(sanitize_string(userID))
        JobIDval = sanitize_string(JobID)
        RequestJobTable.objects.filter(JobID = JobIDval,userID = userIDval).delete()
        data = list(JobsTable.objects.filter(id = JobIDval).values())
        ids = data[0]['RequestIDs']  
        requestdict = data[0]['Request']
        if ids != None:
            custom = [*ids]
            for x in custom:
                if x == userIDval:                    
                    custom.remove(userIDval)
        if requestdict != None:
            for x in requestdict:
                if x['chatID'] == userIDval:
                    requestdict.remove(x)
                    break
        db = JobsTable.objects.filter(id = JobIDval)
        db.update(RequestIDs = custom,Request = requestdict)
        JobsTable.save
        responseval =  {'status' : 'success','message' : 'Request Withdrawn.'}
        return responseval
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval

@circuit
@database_sync_to_async
def StartNewChatFunc(group_name,SenderId,RecieverId,Details,email):
        if group_name != '' and group_name != 'null' and SenderId != '' and SenderId != 'null' and RecieverId != '' and RecieverId != 'null':
            now = datetime.datetime.now()
            short_date = str(now.strftime("%I:%M:%S %p"))
            customChat = [{
                "name" : Details[email]['name'],
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

@circuit
@database_sync_to_async
def ApproveRequestFunc(Details):
    if Details != '' and Details != None:
        idval = Details[1]

        data = JobsTable.objects.filter(id = idval)
        valuedata = list(data.values())
        AcceptedRequestval = valuedata[0]['AcceptedRequest']
        AcceptedIDsval = valuedata[0]['AcceptedIDs']
        Requestval = valuedata[0]['Request']
        if AcceptedRequestval != None:
            AcceptedIDsval.append(Details[0]['chatID'])
            
            AcceptedRequestval.append(Details[0])
        else:
            AcceptedRequestval = [Details[0]]
            AcceptedIDsval = [Details[0]['chatID']]
        if Requestval != None:
            for x in Requestval:
                if x['chatID'] == Details[0]['chatID']:
                    Requestval.remove(x)
                    break
        data.update(Request = Requestval,AcceptedRequest = AcceptedRequestval,AcceptedIDs = AcceptedIDsval)
        JobsTable.save
        responseval =  {'status' : 'success','message' : 'Request Approved.'}
        return responseval
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval


@circuit
@database_sync_to_async
def MyjobLogChatsFunc(RecieverId,SenderId):   
    if(SenderId != 'null' and RecieverId != 'null'):
        val =  list(PersonalChats.objects.all().values().filter( Q(SenderId = SenderId,RecieverId = RecieverId) | Q(RecieverId = SenderId,SenderId = RecieverId) )) 
        
        if len(val) != 0:
            return ['true',val]
        else:
            val = list(Account.objects.filter(id = RecieverId).values('id','name','ProfilePic','about','email'))

            return ['false',val]

@circuit
@database_sync_to_async
def DoneJobFunc(Details):
    if Details != '' and Details != None:
        idval = sanitize_string(Details['id'])
        users = Details['AcceptedIDs']
        jobdetails = {
            'Details' : Details['Details'],            
            'OpenedDate' : Details['OpenedDate'],
            'ClosedDate' : Details['ClosedDate']
        }
        JobsTable.objects.filter(id = idval).delete()
        RequestJobTable.objects.filter(JobID = idval).delete()
        for x in users:
            xval = sanitize_string(x)
            db = Account.objects.filter(id = xval)
            valdata = list(db.values())
            JobsHistory = valdata[0]['JobsHistory']
            if JobsHistory != None:
                JobsHistory.append(jobdetails)
                db.update(JobsHistory = JobsHistory)
            else:
                val = [jobdetails]
                db.update(JobsHistory = val)
            Account.save
        
        responseval =  {'status' : 'success','message' : 'Successful.'}
        return responseval
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval

@circuit
@database_sync_to_async
def JobHistoryFunc(id):
    if id != None and id != '':
        idval = sanitize_string(id)
        data = list(Account.objects.filter(id = idval).values('JobsHistory'))
        val = data[0]['JobsHistory']
        if len(data) != 0:
            return val
        else:
            responseval =  {'status' : 'error','message' : 'Data not found.'}
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval

@circuit
@database_sync_to_async
def DeleteJobHistoryFunc (id,Position):
    if id != None and id != '' and Position != '' and Position != None:
        idval = sanitize_string(id)
        pos = int(sanitize_string(Position))
        data = list(Account.objects.filter(id = idval).values('JobsHistory'))
        val = data[0]['JobsHistory']
        if val != None:
            val.pop(pos)
        Account.objects.filter(id = idval).update(JobsHistory = val)
        Account.save
        responseval =  {'status' : 'success','message' : 'Successfuly Deleted.'}
        return responseval
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data.'}
        return responseval

@circuit
@database_sync_to_async
def DeleteJobFunc(idval,email):
    if idval != '' and idval != 'null' and email != '' and email != 'null':
        id = sanitize_string(idval)
        JobsTable.objects.filter(id = id, email = email).delete()
        responseval =  {'status' : 'success','message' : 'Job deleted Successfuly'}
    else:
        responseval =  {'status' : 'error','message' : 'Invalid Data or Job was already deleted.'}
    return responseval


@circuit
@sync_to_async
def ToogleOnline(props,email = None):    
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
            lastseenval = val[0]['lastSeen']
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
            short_date = now.strftime("%d-%m-%Y")
            if(onlineval != None):
                if emailval in onlineval:
                    onlineval.remove(emailval)
            if lastseenval != None:
                mylastseen = {
                    'email' : emailval,
                    'time' : str(short_date)
                }
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
            onlineval = val[0]['online']
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
            message = text_data_json['message']
            SenderId = text_data_json['SenderId']
            RecieverId = text_data_json['RecieverId']
            email = text_data_json['email']
            name = text_data_json['name']
            groopName = text_data_json['group_name']
            upload =  text_data_json['upload']
            src = text_data_json['src']
            action = text_data_json['action'] 
            Deltime = text_data_json['Deltime'] 
            ReplyChat = text_data_json['ReplyChat'] 
            ReplyChatName = text_data_json['ReplyChatName']   
            delEmail = text_data_json['delEmail']   
            val = await PrivateChatLog(delEmail = delEmail,ReplyChatName = ReplyChatName,ReplyChat = ReplyChat,Deltime = Deltime,action = action,upload = upload,name = name,email = email, src = src,RecieverId = RecieverId,Groupname=groopName,SenderId=SenderId,message=message)

            await self.channel_layer.group_send(
                self.room_group_name, {'type' : 'chat.message','message' :val}
                )
        if scope == 'Groups':            
            message = text_data_json['message']
            email = text_data_json['email']
            name = text_data_json['sender']
            groopName = text_data_json['group_name']
            upload =  text_data_json['upload']
            src = text_data_json['src']      
            action = text_data_json['action'] 
            Deltime = text_data_json['Deltime']              
            ReplyChat = text_data_json['ReplyChat'] 
            ReplyChatName = text_data_json['ReplyChatName'] 
            delEmail = text_data_json['delEmail']
            val = await GroupChatLogGroup(delEmail = delEmail,ReplyChatName = ReplyChatName,ReplyChat = ReplyChat,Deltime = Deltime,action = action,upload = upload, src = src,name = name,Groupname=groopName,email=email,message=message)

            await self.channel_layer.group_send(
                self.room_group_name, {'type' : 'chat.message','message' :val}
                )
        
        if scope == 'Community':            
            message = text_data_json['message']
            email = text_data_json['email']
            name = text_data_json['sender']
            groopName = text_data_json['group_name']
            upload =  text_data_json['upload']
            src = text_data_json['src']      
            action = text_data_json['action'] 
            Deltime = text_data_json['Deltime']            
            ReplyChat = text_data_json['ReplyChat'] 
            ReplyChatName = text_data_json['ReplyChatName'] 
            delEmail = text_data_json['delEmail']
            val = await CommunityChatLogGroup(delEmail = delEmail,ReplyChatName = ReplyChatName,ReplyChat = ReplyChat,Deltime = Deltime,action = action,upload = upload, src = src,name = name,Groupname=groopName,email=email,message=message)

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
                email = text_data_json['email']
                if email != 'null' :
                    name = text_data_json['name']
                    ProfilePic = text_data_json['ProfilePic']
                    about = text_data_json['about']     
                    val = await EditProfileFunc(about=about,name=name,ProfilePic = ProfilePic,email=email)           
       
                    await self.send_msg(data=val,type='EditProfile')
                else:
                    val = {'status' : 'error','message' : 'invalid email'}
                    await self.send_msg(data=val,type='EditProfile')
            elif(message == 'NotePadlogs'):
                email = text_data_json['email']
                if email != 'null' :
                    val = await NotePadlogs(email=email)            
                    await self.send_msg(data=val,type='NotePadlogs')
                else:
                    val = {'status' : 'error','message' : 'invalid email'}
                    await self.send_msg(data=val,type='NotePadlogs')
            elif(message == 'NotePadlogsDelete'):
                email = text_data_json['email']
                title = text_data_json['title']
                if email != 'null' and title != 'null' :
                    val = await NotePadlogsDelete(email=email, title = title)            
                    await self.send_msg(data=val,type='NotePadlogsDelete')
                else:
                    val = {'status' : 'error','message' : 'invalid email'}
                    await self.send_msg(data=val,type='NotePadlogsDelete')
            elif(message == 'SubmitNoteChat'):
                email = text_data_json['email']
                title = text_data_json['title']
                text = text_data_json['text']
                val = await SubmitNoteFunc(email = email, title = title,text=text)
                await self.send_msg(data=val,type='SubmitNoteChat')
            elif(message == 'AddNote'):
                email = text_data_json['email']
                title = text_data_json['title']
                val = await AddNoteFunc(title= title, email = email)
                await self.send_msg(data=val,type='AddNote')
            elif(message == 'Groups'):
                val = await GroupListFunc()            
                await self.send_msg(data=val,type='Groups')
            elif(message == 'Chats'):
                RecieverId = text_data_json['RecieverId']        
                emailval = text_data_json['email']
                onlineStatusData = []
                if emailval != 'null':
                    onlineStatusData = await ToogleOnline(props='AddOnline',email=emailval)
                
                val = await ChatListFunc(RecieverId)
                await self.send_msg(data=val,type='Chats',online=onlineStatusData)
            elif (message == 'Offline'):
                emailval = text_data_json['email']
                onlineStatusData = await ToogleOnline(props='AddOnline',email=emailval)                
                val = {'status' : 'offline'}
                await self.send_msg(data=val,type='Offline',online=onlineStatusData)
            elif(message == 'Community'):
                val = await CommunityListFunc()
                await self.send_msg(data=val,type='Community')
            elif(message == 'AllChatLog'):
                scope = text_data_json['scope']
                
                if(scope == 'Chats'):
                    RecieverId = text_data_json['RecieverId']
                    SenderId = text_data_json['SenderId']          
                    val = await ChatLogsFunc(RecieverId,SenderId)
                    await self.send_msg(data=val,type='AllChatLogChats') 
                elif(scope == 'Groups'):
                    roomName = text_data_json['roomName']
                    val = await GroupLogsFunc(roomName)
                    await self.send_msg(data=val,type='AllChatLog')
                elif(scope == 'Community'):
                    roomName = text_data_json['roomName']
                    val = await CommunityLogsFunc(roomName)          
                    await self.send_msg(data=val,type='AllChatLog')
                
            elif(message == 'Suggestions'):
                RecieverId = text_data_json['RecieverId']
                emailval = text_data_json['email']
                onlineStatusData = []
                if emailval != 'null':
                    onlineStatusData = await ToogleOnline(props='AddOnline',email=emailval)
                val =  await SuggestionsLogsFunc(RecieverIdval = RecieverId)
                await self.send_msg(data=val,type='Suggestions',online=onlineStatusData)

                #fettch all the data log either chat or group in the db then return it
            elif (message == 'JoinRequest'):
                about = text_data_json['about']
                email = text_data_json['email']
                id = text_data_json['id']
                roomName = text_data_json['roomName']
                GroupName = text_data_json['GroupName']
                profilePic = text_data_json['profilePic']
                val = await JoinRequest(about = about,profilePic = profilePic, room_name = roomName, email = email, id = id,groupname=GroupName)
                await self.send_msg(data= val, type='JoinRequest')
            elif(message == 'UpdateRequest'):
                email = text_data_json['email']
                roomName = text_data_json['roomName']
                choice = text_data_json['choice']
                id = text_data_json['id']

                val = await UpdateRequest(id = id,choice = choice, room_name = roomName, email = email)
                await self.send_msg(data= val, type='UpdateRequest')
            elif(message == 'GetRequestMade'):
                id = text_data_json['id']
                val = await GetRequestMade( id = id)
                await self.send_msg(data= val, type='GetRequestMade')
            elif(message == 'RequestsList'):
                 email = text_data_json['email']
                 val = await RequestsList(email = email)
                 await self.send_msg(data=val,type='RequestsList')
            elif(message == 'RemoveRequest'):
                id = text_data_json['id']
                roomName = text_data_json['roomName']
                val = await RemoveRequest(room_name = roomName, id = id)
                await self.send_msg(data= val, type='RemoveRequest')
            elif(message == 'CreateFriend'):
                RecieverId = text_data_json['RecieverId']  
                SenderId = text_data_json['SenderId'] 
                detailval = text_data_json['detailval']  
                val = await  CreateFriend(SenderId = SenderId,RecieverId =RecieverId,detailval = detailval)
                await self.send_msg(data= val, type='CreateFriend')
            elif(message == 'PostJob'):
                Details =  text_data_json['Details']
                email =  text_data_json['email']
                CreatorsID = text_data_json['CreatorsID']
                OpenedDate =  text_data_json['OpenedDate']
                location =  text_data_json['location']
                imageName =  text_data_json['imageName']
                val = await  PostJobFunc(CreatorsID =CreatorsID,email = email,imageName=imageName,Details = Details,OpenedDate =OpenedDate,location = location)
                await self.send_msg(data= val, type='PostJob')
            elif(message == 'FindJobs'):
                OpenedDate =  text_data_json['OpenedDate']
                location =  text_data_json['location']
                val = await  FindJobsFunc(OpenedDate =OpenedDate,location = location)
                await self.send_msg(data= val, type='FindJobs')
            elif(message== 'RequestJob'):
                details =  text_data_json['details']
                val = await  RequestJobFunc(details = details)
                await self.send_msg(data= val, type='RequestJob')
            elif(message== 'DeleteJob'):
                idval =  text_data_json['idval']
                email =  text_data_json['email']
                val = await  DeleteJobFunc(idval = idval,email = email)
                await self.send_msg(data= val, type='DeleteJob')
            elif(message== 'MyJobs'):
                userID =  text_data_json['userID']
                email = text_data_json['email']
                val = await  MyJobsFunc(userID = userID,email = email)
                await self.send_msg(data= val, type='MyJobs')
            elif(message== 'ReadMore'):
                JobID =  text_data_json['JobID']
                email = text_data_json['email']
                val = await  ReadMoreFunc(JobID = JobID,email = email)
                await self.send_msg(data= val, type='ReadMore')
            elif(message== 'WithdrawRequest'):
                JobID =  text_data_json['JobID']
                userID = text_data_json['userID']
                val = await  WithdrawRequestFunc(JobID = JobID,userID = userID)
                await self.send_msg(data= val, type='WithdrawRequest')
            elif (message == 'MyjobLogChats'):
                RecieverId = text_data_json['RecieverId']
                SenderId = text_data_json['SenderId']          
                val = await MyjobLogChatsFunc(RecieverId,SenderId)
                await self.send_msg(data=val,type='MyjobLogChats')
            elif(message == 'StartNewChat'):
                RecieverId = text_data_json['RecieverId']
                SenderId = text_data_json['SenderId']  
                email = text_data_json['email']
                group_name = text_data_json['group_name']
                Details = text_data_json['Details']
                val = await StartNewChatFunc(email=email,Details=Details,RecieverId = RecieverId,SenderId = SenderId,group_name = group_name)
                await self.send_msg(data=val,type='StartNewChat') 
            elif(message == 'ApproveRequest'):
                Details = text_data_json['Details']
                val = await ApproveRequestFunc(Details=Details)
                await self.send_msg(data=val,type='ApproveRequest')
            elif (message == 'DoneJob'):
                Details = text_data_json['Details']
                val = await DoneJobFunc(Details=Details)
                await self.send_msg(data=val,type='DoneJob') 
            elif (message == 'JobHistory'):
                id = text_data_json['id']
                val = await JobHistoryFunc(id=id)
                await self.send_msg(data=val,type='JobHistory') 
            elif (message == 'DeleteJobHistory'):
                id = text_data_json['id']
                Position = text_data_json['Position']
                val = await DeleteJobHistoryFunc(id=id,Position = Position)
                await self.send_msg(data=val,type='DeleteJobHistory') 




   


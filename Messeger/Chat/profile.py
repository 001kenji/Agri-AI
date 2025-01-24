from .models import Account, SavedPost,sanitize_string,Post
from django.db.models import Q
from .serializers import PostSerializer,SavedPostSerializer



# function to handle profile - About section
def ProfileAbout(props,email,Profiledata):

    if props == 'Overview':
       
        emailval = sanitize_string(email)
        
        AboutUser = list(Account.objects.filter(email=emailval).values('ProfileAbout'))
        # print(AboutUser,len(AboutUser))
        if AboutUser[0]['ProfileAbout'] == None:
            myOverview = {
                'Overview' : Profiledata
            }
            x = Account.objects.filter(email=emailval)
            x.update(ProfileAbout=myOverview)
            Account.save
            return {'success' : 'data saved'}
        else:
            val = AboutUser[0]['ProfileAbout']
            val['Overview'] = Profiledata
            #print(val)
            x = Account.objects.filter(email=emailval)
            x.update(ProfileAbout=val)
            Account.save
        return {'success' : 'data saved'}
    elif props == 'Contact':
        emailval = sanitize_string(email)
        
        AboutUser = list(Account.objects.filter(email=emailval).values('ProfileAbout'))
        # print(AboutUser,len(AboutUser))
        if AboutUser[0]['ProfileAbout'] == None:
            myOverview = {
                'Contact' : Profiledata
            }
            x = Account.objects.filter(email=emailval)
            x.update(ProfileAbout=myOverview)
            Account.save
            return {'success' : 'data saved'}
        else:
            val = AboutUser[0]['ProfileAbout']
            val['Contact'] = Profiledata
            print(val)
            x = Account.objects.filter(email=emailval)
            x.update(ProfileAbout=val)
            Account.save
        return {'success' : 'data saved'}



def get_posts_by_email(email,id ):
    try:
        emailval = sanitize_string(email)
        # Step 1: Retrieve the Account instance using the email
        account = Account.objects.get(id = id)
        #print('attempting ------------------')
        # Step 2: Get all posts related to that account
        posts = account.posts.all()[:3]  # Using related_name='posts' , reading maximum of [:1] data
        serializedData = PostSerializer(posts, many=True)
        postData = serializedData.data
        #print(postData)
        for x in postData:
            #print(x)
            likes = x['likes']
            #print(likes)
            if likes != None:
                lengthval = len(likes)
                x['likes'] = lengthval
                if emailval in likes:
                    x['IsUserLiked'] = True
                else:
                    x['IsUserLiked'] = False
            else:
                x['likes'] = 0
                x['IsUserLiked'] = False
            #print('\n',x)
        return postData  # This will be a QuerySet of Post objects
    except Account.DoesNotExist:
        return None  # Handle the case where the account does not exist
    

#acc = Account.objects.get(email = 'kenjicladia@gmail.com')


# print('\nfetching-----------')
# saved_posts = SavedPost.objects.filter(account_email=acc).select_related('post_id')[:5]  # Filter SavedPost by Account instance

# # Retrieve all related Post data
# print('\nloaded\n')
# d = SavedPostSerializer(saved_posts,many=True)


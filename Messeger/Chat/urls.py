from django.urls import re_path,path
from . import views
urlpatterns = [
    path('test/',views.Test.as_view(), name='testing api'),
    path('',views.index, name='index page '),
    path('profile/',views.ProfileView.as_view(), name='index page '),
    path('profiledocs/',views.UploadProfileDocs.as_view(), name='uploading profile documents page '),
    path('logout/', views.LogoutView.as_view(),name="logut view"),
    #path('<str:room_name>/',views.room, name='room'),
    path('posts/<str:post_id>/',views.PostHtmlView.as_view(), name='post html view'),
    path('upload/', views.FileUploadView.as_view(), name='file-upload'),
]

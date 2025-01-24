from django.urls import re_path

from . import consumers

websocket_urlpatterns = [
    re_path(
        r'ws/chat/(?P<room_name>[a-f0-9\-]+)/$',
        #r"ws/chat/(?P<room_name>\w+)/$",
        consumers.ChatConsumer.as_asgi(),
    ),
    re_path(
    r"ws/chatList/(?P<email>[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/$",
    consumers.ChatList.as_asgi(),
    ),
    re_path(
    r"ws/ai/(?P<email>[\w.%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,})/$",
    consumers.AIConsumer.as_asgi(),
    )


]


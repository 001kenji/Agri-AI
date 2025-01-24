"""
ASGI config for Messeger project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator,OriginValidator
from django.core.asgi import get_asgi_application
from Chat.routing import websocket_urlpatterns
import Chat.routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Messeger.settings')
django_asgi_app = get_asgi_application()
#application = get_asgi_application()
application = ProtocolTypeRouter(  #configuration for channels redis
    {
        "http": django_asgi_app,
        "https": django_asgi_app,
        "websocket": OriginValidator(
            AuthMiddlewareStack(URLRouter(websocket_urlpatterns)),
        allowed_origins=[os.environ.get('FRONTEND_URL') ,os.environ.get('HostPath') ],
        ),
        
    }
)
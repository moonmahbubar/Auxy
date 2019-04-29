"""auxy URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from rest_framework import routers
from room import views






router = routers.DefaultRouter()
router.register(r'rooms', views.RoomViewSet)
router.register(r'hosts', views.HostViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'songs', views.SongViewSet)


urlpatterns = [
    # path(r'play_song/<str:token>', views.play_with_token),
    # path(r'play_room/<str:code>', views.play_room_song),
    path(r'test/<str:code>', views.SpotifyTestView.as_view()),
    path(r'song/<str:code>/<str:song>', views.PlaySongView.as_view()),
    path(r'search/<str:code>/<str:song>', views.SearchSongView.as_view()),
    path(r'create_host/<str:room_name>/<str:display_name>/<str:auth_code>', views.CreateHostView.as_view()),
    path(r'send_auth_code/<str:url>', views.UpdateTokensView.as_view()),
    path(r'get_room_users/<str:code>', views.GetRoomUsersView.as_view()),
    path(r'join_room/<str:display_name>/<str:code>', views.JoinRoomView.as_view()),
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api', include('rest_framework.urls', namespace='rest_framework')),
]
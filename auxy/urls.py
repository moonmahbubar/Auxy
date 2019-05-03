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


#Set up pages so we can get see all the objects of a model.
router = routers.DefaultRouter()
router.register(r'rooms', views.RoomViewSet)
router.register(r'hosts', views.HostViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'songs', views.SongViewSet)


#Define the urls for the rest API.
#If you wanna see more details about the the API calls, please go to room/views.py and check the corresponding views to the url.
urlpatterns = [
    path(r'test/<str:code>', views.SpotifyTestView.as_view()),
    path(r'song/<str:code>/<str:song>', views.PlaySongView.as_view()),
    path(r'search/<str:code>/<str:song>', views.SearchSongView.as_view()),
    path(r'create_host/<str:room_name>/<str:display_name>/<str:auth_code>', views.CreateHostView.as_view()),
    path(r'send_auth_code/<str:url>', views.UpdateTokensView.as_view()),
    path(r'get_room_info/<str:code>', views.GetRoomInfoView.as_view()),
    path(r'join_room/<str:display_name>/<str:code>', views.JoinRoomView.as_view()),
    path(r'push_song/<str:code>/<str:track_id>/<str:track_name>/<str:track_artist>/<str:track_art>/<int:track_length>/<int:votes>', views.PushSongView.as_view()),
    path(r'pop_song/<str:code>', views.PopSongView.as_view()),
    path(r'play_id/<str:code>/<str:id>', views.PlayIDView.as_view()),
    path(r'get_room_queue/<str:code>', views.GetRoomQueueView.as_view()),
    path(r'remove_song/<int:auto_increment_id>', views.DeleteSongView.as_view()),
    path(r'refresh_token/<str:code>', views.RefreshTokenView.as_view()),
    path(r'delete_user/', views.DeleteUserView.as_view()),
    path(r'deactivate_room/', views.DeactivateRoomView.as_view()),
    path(r'get_current_playback/<str:code>', views.GetCurrentPlaybackView.as_view()),
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('api', include('rest_framework.urls', namespace='rest_framework')),
]
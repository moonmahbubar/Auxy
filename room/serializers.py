from room.models import Room, Host, User, Song
from rest_framework import serializers

class RoomSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Room 
        fields = ('name', 'code')

class HostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Host 
        fields = ('display_name', 'host_token', 'host_refresh_token', 'room')

class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User 
        fields = ('display_name', 'room')

class SongSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Song
        fields = ('auto_increment_id', 'track_id', 'track_name', 'track_artist', 'track_art', 'track_length', 'date_added', 'votes', 'room')
    
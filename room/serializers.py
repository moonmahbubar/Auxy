from room.models import Room, Host, User, Song
from rest_framework import serializers

#The following serializer takes the Room object and converts it to json format for the rest API.
class RoomSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Room 
        #Define the fields to be displayed in the API response.
        fields = ('name', 'code', 'is_active')

#The following serializer takes the Host object and converts it to json format for the rest API.
class HostSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Host 
        #Define the fields to be displayed in the API response.
        fields = ('display_name', 'host_token', 'host_refresh_token', 'room')

#The following serializer takes the User object and converts it to json format for the rest API.
class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        #Define the fields to be displayed in the API response. 
        fields = ('display_name', 'room')

#The following serializer takes the Song object and converts it to json format for the rest API.
class SongSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Song
        #Define the fields to be displayed in the API response.
        fields = ('auto_increment_id', 'track_id', 'track_name', 'track_artist', 'track_art', 'track_length', 'date_added', 'votes', 'room')
    
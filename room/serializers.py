from room.models import Room, Host, User
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

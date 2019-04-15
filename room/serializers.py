from room.models import Room, Host, User
from rest_framework import serializers

class RoomSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Room 
        fields = ('name', 'code')


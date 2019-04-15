from room.models import Room, Host, User
from rest_framework import viewsets 
from room.serializers import RoomSerializer

# Create your views here.


class RoomViewSet(viewsets.ModelViewSet):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer



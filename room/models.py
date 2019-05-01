from django.db import models
from random import randrange
from django.utils.crypto import get_random_string
from django.utils import timezone

class Room(models.Model):
    """Model representing a room for users to join."""
    name = models.CharField(max_length=200, help_text='Enter a room name.')
    code = models.CharField(max_length=6, default=get_random_string)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        """String for representing the room Model object."""
        return self.name
    
    def get_room_users(self):
        """Returns a list of users of the room."""
        return self.user_set
    

class Song(models.Model):
    """Model representing a song to be played."""
    auto_increment_id = models.AutoField(primary_key=True)
    track_id =  models.CharField(max_length=200)
    track_name =  models.CharField(max_length=200)
    track_artist = models.CharField(max_length=200)
    track_art =  models.CharField(max_length=200)
    track_length = models.IntegerField()
    date_added = models.DateTimeField(default=timezone.now)
    votes = models.IntegerField(default=0)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, default=None)


    def __str__(self):
        """String for representing the song object"""
        return self.track_name
    

class User(models.Model):
    display_name = models.CharField(max_length=200, help_text='Enter a your display name.')
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self):
        """String for representing the user Model object."""
        return self.display_name



class Host(models.Model):
    display_name = models.CharField(max_length=200, help_text='Enter a your display name.')
    host_token = models.CharField(max_length=600)
    host_refresh_token = models.CharField(max_length=600)
    room = models.OneToOneField(Room, on_delete=models.CASCADE, default=None)

    def __str__(self):
        """String for representing the host Model object."""
        return self.display_name





    

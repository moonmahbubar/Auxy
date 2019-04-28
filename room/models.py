from django.db import models
from random import randrange
from django.utils.crypto import get_random_string

class Room(models.Model):
    """Model representing a room for users to join."""
    name = models.CharField(max_length=200, help_text='Enter a room name.')
    code = models.CharField(max_length=6, default=get_random_string)

    def __str__(self):
        """String for representing the room Model object."""
        return self.name

class User(models.Model):
    display_name = models.CharField(max_length=200, help_text='Enter a your display name.')
    room = models.ForeignKey(Room, on_delete=models.CASCADE)

    def __str__(self):
        """String for representing the user Model object."""
        return self.display_name

    #  @classmethod
    # def create(cls, display_name, code):
    #     book = cls(title=title)
    #     # do something with the book
    #     return book


class Host(models.Model):
    display_name = models.CharField(max_length=200, help_text='Enter a your display name.')
    host_token = models.CharField(max_length=600)
    host_refresh_token = models.CharField(max_length=600)
    room = models.OneToOneField(Room, on_delete=models.CASCADE, default=None)

    def __str__(self):
        """String for representing the host Model object."""
        return self.display_name



def get_room_users(room):
    """Returns a list of users for a given room."""
    return room.user_set

    

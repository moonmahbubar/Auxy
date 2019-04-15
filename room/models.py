from django.db import models


class Room(models.Model):
    """Model representing a room for users to join."""
    name = models.CharField(max_length=200, help_text='Enter a room name.')
    code = models.CharField(max_length=6, default = "000000")

    def __str__(self):
        """String for representing the room Model object."""
        return self.name
    

class Host(models.Model):
    display_name = models.CharField(max_length=200, help_text='Enter a your display name.')
    host_token = models.CharField(max_length=600)
    host_refresh_token = models.CharField(max_length=600)
    room = models.OneToOneField(Room, on_delete=models.CASCADE, default = None)

    def __str__(self):
        """String for representing the host Model object."""
        return self.display_name

class User(models.Model):
    display_name = models.CharField(max_length=200, help_text='Enter a your display name.')
    room = models.ForeignKey(Room, on_delete=models.CASCADE)


    def __str__(self):
        """String for representing the user Model object."""
        return self.display_name





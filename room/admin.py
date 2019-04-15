from django.contrib import admin
from room.models import Room, Host, User

# Register your models here.
admin.site.register(Room)
admin.site.register(Host)
admin.site.register(User)
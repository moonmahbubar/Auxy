from django.contrib import admin
from room.models import Room, Host, User, Song

# Register your models here.
# The models are registered so we can modify them on the admin page.
# The admin page is on localhost:8000/admin
# If you want to create a login, do python3 manage.py createsuperuser
admin.site.register(Room)
admin.site.register(Host)
admin.site.register(User)
admin.site.register(Song)


#Just some for how user page is displayed on admin page.
class UserInline(admin.TabularInline):
    model = User

class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    inlines = [UserInline]
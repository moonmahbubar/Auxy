from django.contrib import admin
from room.models import Room, Host, User

# Register your models here.
admin.site.register(Room)
admin.site.register(Host)
admin.site.register(User)

class UserInline(admin.TabularInline):
    model = User

class RoomAdmin(admin.ModelAdmin):
    list_display = ('name', 'code')
    inlines = [UserInline]
# Generated by Django 2.2 on 2019-04-22 22:17

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0002_auto_20190415_1440'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='code',
            field=models.CharField(default=uuid.uuid4, max_length=6),
        ),
    ]

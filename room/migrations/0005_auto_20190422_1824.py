# Generated by Django 2.2 on 2019-04-22 22:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('room', '0004_auto_20190422_1822'),
    ]

    operations = [
        migrations.AlterField(
            model_name='room',
            name='code',
            field=models.CharField(default='O4NX65', max_length=6, unique=True),
        ),
    ]

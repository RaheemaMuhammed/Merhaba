# Generated by Django 4.2.7 on 2024-01-04 07:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='chatroom',
            name='is_expired',
            field=models.BooleanField(default=False),
        ),
    ]
# Generated by Django 4.2.7 on 2024-01-04 05:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('authentication', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='registration_method',
            field=models.CharField(choices=[('email', 'Email'), ('google', 'Google')], default='email', max_length=10),
        ),
    ]
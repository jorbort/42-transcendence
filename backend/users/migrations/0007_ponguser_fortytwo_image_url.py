# Generated by Django 5.1 on 2024-10-22 02:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0006_ponguser_avatar'),
    ]

    operations = [
        migrations.AddField(
            model_name='ponguser',
            name='fortytwo_image_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]
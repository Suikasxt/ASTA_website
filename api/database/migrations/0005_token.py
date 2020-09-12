# Generated by Django 3.0.2 on 2020-08-12 08:55

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    dependencies = [
        ('database', '0004_auto_20200804_2340'),
    ]

    operations = [
        migrations.CreateModel(
            name='Token',
            fields=[
                ('email', models.CharField(default='', max_length=40, primary_key=True, serialize=False)),
                ('token', models.CharField(default='', max_length=1024)),
                ('updateTime', models.DateTimeField(default=django.utils.timezone.now)),
            ],
        ),
    ]
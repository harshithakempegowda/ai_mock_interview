from django.db import models
from django.conf import settings


class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='profile')
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    bio = models.TextField(blank=True)
    skills = models.TextField(blank=True, help_text='Comma separated list of skills')
    education = models.TextField(blank=True, help_text='JSON or text description of education')
    designation = models.CharField(max_length=100, blank=True)
    location = models.CharField(max_length=100, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"

    @property
    def skills_list(self):
        return [s.strip() for s in self.skills.split(',') if s.strip()]

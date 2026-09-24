from django.db import models
from django.conf import settings


class Resume(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='resumes')
    file = models.FileField(upload_to='resumes/')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    extracted_name = models.CharField(max_length=150, blank=True)
    extracted_email = models.CharField(max_length=150, blank=True)
    extracted_phone = models.CharField(max_length=50, blank=True)
    extracted_skills = models.TextField(blank=True)
    extracted_education = models.TextField(blank=True)
    extracted_projects = models.TextField(blank=True)
    raw_text = models.TextField(blank=True)

    resume_score = models.FloatField(default=0)
    suggestions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} resume ({self.uploaded_at.date()})"

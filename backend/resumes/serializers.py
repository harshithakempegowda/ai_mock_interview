from rest_framework import serializers
from .models import Resume


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = ['id', 'file', 'uploaded_at', 'extracted_name', 'extracted_email', 'extracted_phone',
                  'extracted_skills', 'extracted_education', 'extracted_projects',
                  'resume_score', 'suggestions']

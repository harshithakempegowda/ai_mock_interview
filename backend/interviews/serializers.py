from rest_framework import serializers
from .models import Interview, InterviewResponse, InterviewQuestionBank


class InterviewQuestionBankSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewQuestionBank
        fields = ['id', 'interview_type', 'text']


class InterviewResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewResponse
        fields = ['id', 'question_text', 'answer_text', 'answer_duration_seconds', 'order']


class InterviewSerializer(serializers.ModelSerializer):
    responses = InterviewResponseSerializer(many=True, read_only=True)

    class Meta:
        model = Interview
        fields = ['id', 'user', 'interview_type', 'status', 'started_at', 'completed_at',
                  'duration_seconds', 'overall_score', 'communication_score', 'technical_score',
                  'confidence_score', 'feedback', 'strengths', 'weaknesses', 'suggestions', 'responses']
        read_only_fields = ['user']

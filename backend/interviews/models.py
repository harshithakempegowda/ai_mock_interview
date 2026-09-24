from django.db import models
from django.conf import settings

INTERVIEW_TYPES = [
    ('technical', 'Technical'),
    ('hr', 'HR'),
    ('behavioral', 'Behavioral'),
    ('coding', 'Coding'),
]

class InterviewQuestionBank(models.Model):
    QUESTION_TYPES = [
        ('technical', 'Technical'),
        ('hr', 'HR'),
        ('behavioral', 'Behavioral'),
        ('coding', 'Coding'),
        ('aptitude', 'Aptitude'),
    ]

    DIFFICULTY_LEVELS = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    interview_type = models.CharField(
        max_length=20,
        choices=QUESTION_TYPES
    )

    question_text = models.TextField()

    option_a = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    option_b = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    option_c = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    option_d = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    correct_option = models.CharField(
        max_length=1,
        blank=True,
        null=True
    )

    explanation = models.TextField(
        blank=True,
        null=True
    )

    difficulty = models.CharField(
        max_length=20,
        choices=DIFFICULTY_LEVELS,
        default='easy'
    )

    category = models.CharField(
        max_length=100,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.interview_type} - {self.question_text[:50]}"



class Interview(models.Model):
    STATUS_CHOICES = [('in_progress', 'In Progress'), ('completed', 'Completed')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='interviews')
    interview_type = models.CharField(max_length=20, choices=INTERVIEW_TYPES, default='technical')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='in_progress')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration_seconds = models.IntegerField(default=0)

    overall_score = models.FloatField(default=0)
    communication_score = models.FloatField(default=0)
    technical_score = models.FloatField(default=0)
    confidence_score = models.FloatField(default=0)
    feedback = models.TextField(blank=True)
    strengths = models.TextField(blank=True)
    weaknesses = models.TextField(blank=True)
    suggestions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.interview_type} - {self.status}"


class InterviewResponse(models.Model):
    interview = models.ForeignKey(Interview, on_delete=models.CASCADE, related_name='responses')
    question_text = models.TextField()
    answer_text = models.TextField(blank=True)
    answer_duration_seconds = models.IntegerField(default=0)
    order = models.IntegerField(default=0)

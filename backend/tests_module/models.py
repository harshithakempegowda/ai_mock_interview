from django.db import models
from django.conf import settings

CATEGORY_CHOICES = [
    ('aptitude', 'Aptitude'),
    ('behavioral', 'behavioral'),
    ('hr', 'HR'),
    ('coding', 'Coding'),
]


class TestCategory(models.Model):
    name = models.CharField(
        max_length=20,
        choices=CATEGORY_CHOICES,
        unique=True
    )

    description = models.CharField(
        max_length=255,
        blank=True
    )

    def __str__(self):
        return self.get_name_display()


class Question(models.Model):
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    ]

    category = models.ForeignKey(
        TestCategory,
        on_delete=models.CASCADE,
        related_name='questions'
    )

    text = models.TextField()

    option_a = models.CharField(
        max_length=255,
        blank=True
    )

    option_b = models.CharField(
        max_length=255,
        blank=True
    )

    option_c = models.CharField(
        max_length=255,
        blank=True
    )

    option_d = models.CharField(
        max_length=255,
        blank=True
    )

    correct_option = models.CharField(
        max_length=1,
        choices=[
            ('a', 'A'),
            ('b', 'B'),
            ('c', 'C'),
            ('d', 'D')
        ],
        blank=True
    )

    explanation = models.TextField(
        blank=True
    )

    topic = models.CharField(
        max_length=100,
        blank=True
    )

    is_coding = models.BooleanField(
        default=False
    )

    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES,
        default='medium'
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.text[:60]


class TestAttempt(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='test_attempts'
    )

    category = models.ForeignKey(
        TestCategory,
        on_delete=models.CASCADE,
        related_name='attempts'
    )

    started_at = models.DateTimeField(
        auto_now_add=True
    )

    submitted_at = models.DateTimeField(
        null=True,
        blank=True
    )

    score = models.FloatField(
        default=0
    )

    total_questions = models.IntegerField(
        default=0
    )

    correct_answers = models.IntegerField(
        default=0
    )

    def __str__(self):
        return (
            f"{self.user.username} - "
            f"{self.category.name} - "
            f"{self.score}"
        )


class TestAnswer(models.Model):
    attempt = models.ForeignKey(
        TestAttempt,
        on_delete=models.CASCADE,
        related_name='answers'
    )

    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE
    )

    selected_option = models.CharField(
        max_length=1,
        blank=True
    )

    answer_text = models.TextField(
        blank=True
    )

    is_correct = models.BooleanField(
        default=False
    )

    def __str__(self):
        return (
            f"{self.attempt.id} - "
            f"{self.question.id}"
        )
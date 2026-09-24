from rest_framework import serializers
from .models import TestCategory, Question, TestAttempt, TestAnswer


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ['id', 'text', 'option_a', 'option_b', 'option_c', 'option_d', 'is_coding', 'difficulty']


class TestCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = TestCategory
        fields = ['id', 'name', 'description']


class TestAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAnswer
        fields = ['id', 'question', 'selected_option', 'answer_text', 'is_correct']


class TestAttemptSerializer(serializers.ModelSerializer):
    answers = TestAnswerSerializer(many=True, read_only=True)
    category_name = serializers.CharField(source='category.get_name_display', read_only=True)

    class Meta:
        model = TestAttempt
        fields = ['id', 'user', 'category', 'category_name', 'started_at', 'submitted_at',
                   'score', 'total_questions', 'correct_answers', 'answers']
        read_only_fields = ['user', 'score', 'total_questions', 'correct_answers']

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from .models import TestCategory, Question, TestAttempt, TestAnswer
from .serializers import TestCategorySerializer, QuestionSerializer, TestAttemptSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def categories(request):
    cats = TestCategory.objects.all()
    return Response(TestCategorySerializer(cats, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def questions_by_category(request, category_name):
    cat, _ = TestCategory.objects.get_or_create(name=category_name)
    qs = Question.objects.filter(category=cat)
    return Response(QuestionSerializer(qs, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_test(request):
    """
    Expected payload:
    {
      "category": "aptitude",
      "answers": [{"question_id": 1, "selected_option": "a"}, ...]
    }
    """
    category_name = request.data.get('category')
    answers_payload = request.data.get('answers', [])
    cat, _ = TestCategory.objects.get_or_create(name=category_name)

    attempt = TestAttempt.objects.create(
        user=request.user, category=cat,
        submitted_at=timezone.now(),
        total_questions=len(answers_payload)
    )

    correct_count = 0
    for ans in answers_payload:
        try:
            question = Question.objects.get(id=ans.get('question_id'))
        except Question.DoesNotExist:
            continue
        selected = ans.get('selected_option', '')
        is_correct = bool(question.correct_option) and selected == question.correct_option
        if is_correct:
            correct_count += 1
        TestAnswer.objects.create(
            attempt=attempt, question=question,
            selected_option=selected,
            answer_text=ans.get('answer_text', ''),
            is_correct=is_correct
        )

    attempt.correct_answers = correct_count
    attempt.score = round((correct_count / attempt.total_questions) * 100, 2) if attempt.total_questions else 0
    attempt.save()

    return Response(TestAttemptSerializer(attempt).data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_attempts(request):
    attempts = TestAttempt.objects.filter(user=request.user).order_by('-started_at')
    return Response(TestAttemptSerializer(attempts, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def attempt_detail(request, attempt_id):
    try:
        attempt = TestAttempt.objects.get(id=attempt_id, user=request.user)
    except TestAttempt.DoesNotExist:
        return Response({'detail': 'Not found.'}, status=404)
    return Response(TestAttemptSerializer(attempt).data)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from tests_module.models import TestAttempt
from tests_module.serializers import TestAttemptSerializer
from interviews.models import Interview
from interviews.serializers import InterviewSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def all_results(request):
    test_attempts = TestAttempt.objects.filter(user=request.user).order_by('-started_at')
    interviews = Interview.objects.filter(user=request.user, status='completed').order_by('-started_at')

    return Response({
        'test_results': TestAttemptSerializer(test_attempts, many=True).data,
        'interview_results': InterviewSerializer(interviews, many=True).data,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def result_summary(request):
    test_attempts = TestAttempt.objects.filter(user=request.user)
    interviews = Interview.objects.filter(user=request.user, status='completed')

    avg_test_score = round(sum(t.score for t in test_attempts) / test_attempts.count(), 2) if test_attempts.exists() else 0
    avg_interview_score = round(sum(i.overall_score for i in interviews) / interviews.count(), 2) if interviews.exists() else 0

    return Response({
        'total_tests_taken': test_attempts.count(),
        'total_interviews_completed': interviews.count(),
        'average_test_score': avg_test_score,
        'average_interview_score': avg_interview_score,
    })

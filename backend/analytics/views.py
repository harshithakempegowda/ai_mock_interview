from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from tests_module.models import TestAttempt
from interviews.models import Interview


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def analytics_overview(request):
    user = request.user
    test_attempts = TestAttempt.objects.filter(user=user).order_by('started_at')
    interviews = Interview.objects.filter(user=user, status='completed').order_by('started_at')

    interview_score_trend = [
        {'date': i.started_at.strftime('%Y-%m-%d'), 'score': i.overall_score}
        for i in interviews
    ]
    test_score_trend = [
        {'date': t.started_at.strftime('%Y-%m-%d'), 'score': t.score, 'category': t.category.get_name_display()}
        for t in test_attempts
    ]
    communication_trend = [
        {'date': i.started_at.strftime('%Y-%m-%d'), 'score': i.communication_score}
        for i in interviews
    ]
    technical_trend = [
        {'date': i.started_at.strftime('%Y-%m-%d'), 'score': i.technical_score}
        for i in interviews
    ]

    category_breakdown = {}
    for t in test_attempts:
        label = t.category.get_name_display()
        category_breakdown.setdefault(label, []).append(t.score)
    category_pie = [
        {'category': k, 'average_score': round(sum(v) / len(v), 2)}
        for k, v in category_breakdown.items()
    ]

    interview_type_breakdown = {}
    for i in interviews:
        label = i.get_interview_type_display()
        interview_type_breakdown[label] = interview_type_breakdown.get(label, 0) + 1
    interview_type_pie = [{'type': k, 'count': v} for k, v in interview_type_breakdown.items()]

    return Response({
        'total_interviews_completed': interviews.count(),
        'total_tests_taken': test_attempts.count(),
        'interview_score_trend': interview_score_trend,
        'test_score_trend': test_score_trend,
        'communication_trend': communication_trend,
        'technical_trend': technical_trend,
        'category_pie': category_pie,
        'interview_type_pie': interview_type_pie,
    })

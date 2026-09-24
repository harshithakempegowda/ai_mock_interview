from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from tests_module.models import TestAttempt
from interviews.models import Interview


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def history_list(request):
    """
    Combined history with optional filters:
    ?type=test|interview
    ?category= (test category name) or ?interview_type=
    ?search= (matches category/type text)
    """
    type_filter = request.GET.get('type')
    search = request.GET.get('search', '').lower()

    items = []

    if type_filter != 'interview':
        for t in TestAttempt.objects.filter(user=request.user).order_by('-started_at'):
            label = t.category.get_name_display()
            if search and search not in label.lower():
                continue
            items.append({
                'id': t.id,
                'type': 'test',
                'category': label,
                'date': t.started_at,
                'score': t.score,
                'status': 'completed' if t.submitted_at else 'in_progress',
            })

    if type_filter != 'test':
        for i in Interview.objects.filter(user=request.user).order_by('-started_at'):
            label = i.get_interview_type_display()
            if search and search not in label.lower():
                continue
            items.append({
                'id': i.id,
                'type': 'interview',
                'category': label,
                'date': i.started_at,
                'score': i.overall_score,
                'status': i.status,
            })

    items.sort(key=lambda x: x['date'], reverse=True)
    return Response(items)

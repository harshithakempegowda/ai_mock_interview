from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Resume
from .serializers import ResumeSerializer
from .parser import extract_text_from_pdf, parse_resume_text


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_resume(request):
    file = request.FILES.get('file')
    if not file:
        return Response({'detail': 'No file provided.'}, status=400)
    if not file.name.lower().endswith('.pdf'):
        return Response({'detail': 'Only PDF files are supported.'}, status=400)

    resume = Resume.objects.create(user=request.user, file=file)

    text = extract_text_from_pdf(resume.file.path)
    resume.raw_text = text
    parsed = parse_resume_text(text)
    resume.extracted_name = parsed['name']
    resume.extracted_email = parsed['email']
    resume.extracted_phone = parsed['phone']
    resume.extracted_skills = parsed['skills']
    resume.extracted_education = parsed['education']
    resume.extracted_projects = parsed['projects']
    resume.resume_score = parsed['score']
    resume.suggestions = parsed['suggestions']
    resume.save()

    return Response(ResumeSerializer(resume).data, status=201)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_resumes(request):
    resumes = Resume.objects.filter(user=request.user).order_by('-uploaded_at')
    return Response(ResumeSerializer(resumes, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def latest_resume(request):
    resume = Resume.objects.filter(user=request.user).order_by('-uploaded_at').first()
    if not resume:
        return Response({'detail': 'No resume uploaded yet.'}, status=404)
    return Response(ResumeSerializer(resume).data)

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Profile
from .serializers import ProfileSerializer


@api_view(['GET', 'PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def my_profile(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    if request.method == 'GET':
        return Response(ProfileSerializer(profile).data)

    serializer = ProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        # allow updating first/last name on user too
        user = request.user
        first_name = request.data.get('first_name')
        last_name = request.data.get('last_name')
        changed = False
        if first_name is not None:
            user.first_name = first_name
            changed = True
        if last_name is not None:
            user.last_name = last_name
            changed = True
        if changed:
            user.save()
        return Response(ProfileSerializer(profile).data)
    return Response(serializer.errors, status=400)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_picture(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    file = request.FILES.get('profile_picture')
    if not file:
        return Response({'detail': 'No file provided.'}, status=400)
    profile.profile_picture = file
    profile.save()
    return Response(ProfileSerializer(profile).data)

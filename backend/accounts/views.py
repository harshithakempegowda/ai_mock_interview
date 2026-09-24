from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model
from .serializers import SignupSerializer, LoginSerializer, UserSerializer
from .models import PasswordResetOTP

User = get_user_model()


def tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {'refresh': str(refresh), 'access': str(refresh.access_token)}


@api_view(['POST'])
@permission_classes([AllowAny])
def signup(request):
    serializer = SignupSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        tokens = tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            **tokens,
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        tokens = tokens_for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            **tokens,
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_request(request):
    email = request.data.get('email')
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({'detail': 'No account found with that email.'}, status=404)
    code = PasswordResetOTP.generate_code()
    PasswordResetOTP.objects.create(user=user, code=code)
    # In production this would be emailed. Returned here for demo purposes.
    return Response({'detail': 'OTP generated.', 'demo_otp': code}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password_reset(request):
    email = request.data.get('email')
    code = request.data.get('otp')
    new_password = request.data.get('new_password')
    try:
        user = User.objects.get(email=email)
        otp = PasswordResetOTP.objects.filter(user=user, code=code, used=False).latest('created_at')
    except (User.DoesNotExist, PasswordResetOTP.DoesNotExist):
        return Response({'detail': 'Invalid OTP or email.'}, status=400)
    user.set_password(new_password)
    user.save()
    otp.used = True
    otp.save()
    return Response({'detail': 'Password reset successful.'}, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
    except Exception:
        pass
    return Response({'detail': 'Logged out successfully.'}, status=200)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    return Response(UserSerializer(request.user).data)

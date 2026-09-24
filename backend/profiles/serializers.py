from rest_framework import serializers
from .models import Profile
from accounts.serializers import UserSerializer


class ProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    skills_list = serializers.ReadOnlyField()

    class Meta:
        model = Profile
        fields = ['id', 'user', 'profile_picture', 'bio', 'skills', 'skills_list',
                  'education', 'designation', 'location', 'updated_at']

from rest_framework import serializers
from .models import Profile, Project, ProjectImage, Experience, Education, Skill, Certification, Media

class ProfileSerializer(serializers.ModelSerializer):
    avatar_display_url = serializers.SerializerMethodField()
    resume_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_avatar_display_url(self, obj):
        if obj.avatar:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.avatar.url)
            return obj.avatar.url
        return obj.avatar_url or ''

    def get_resume_display_url(self, obj):
        if obj.resume_file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.resume_file.url)
            return obj.resume_file.url
        return obj.resume_url or ''


class ProjectImageSerializer(serializers.ModelSerializer):
    image_display_url = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = '__all__'

    def get_image_display_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return ''


class ProjectSerializer(serializers.ModelSerializer):
    images = ProjectImageSerializer(many=True, read_only=True)
    thumbnail_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True}
        }

    def get_thumbnail_display_url(self, obj):
        if obj.thumbnail:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return obj.thumbnail_url or ''


class ExperienceSerializer(serializers.ModelSerializer):
    company_logo_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = '__all__'

    def get_company_logo_display_url(self, obj):
        if obj.company_logo:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.company_logo.url)
            return obj.company_logo.url
        return obj.company_logo_url or ''

    def validate_work_mode(self, value):
        if value == 'Onsite':
            value = 'On-site'
        valid_modes = [c[0] for c in Experience.WORK_MODE_CHOICES]
        if value not in valid_modes:
            raise serializers.ValidationError(
                f"Invalid work mode '{value}'. Must be one of: {', '.join(valid_modes)}."
            )
        return value

    def validate(self, attrs):
        work_mode = attrs.get('work_mode', getattr(self.instance, 'work_mode', 'Remote') if self.instance else 'Remote')
        if work_mode == 'Onsite':
            work_mode = 'On-site'
            attrs['work_mode'] = 'On-site'

        location = attrs.get('location', getattr(self.instance, 'location', '') if self.instance else '')
        if isinstance(location, str):
            location = location.strip()

        if work_mode in ['On-site', 'Hybrid'] and not location:
            raise serializers.ValidationError({
                'location': f"Location is required for {work_mode} work mode."
            })

        return attrs


class EducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'


class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'


class CertificationSerializer(serializers.ModelSerializer):
    certificate_image_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Certification
        fields = '__all__'

    def get_certificate_image_display_url(self, obj):
        if obj.certificate_image:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.certificate_image.url)
            return obj.certificate_image.url
        return obj.certificate_image_url or ''


class MediaSerializer(serializers.ModelSerializer):
    file_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Media
        fields = '__all__'

    def get_file_display_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return ''

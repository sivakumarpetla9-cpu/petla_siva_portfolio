from rest_framework import serializers
from .models import Profile, Project, ProjectImage, Experience, Education, Skill, Certification, Media

class ProfileSerializer(serializers.ModelSerializer):
    avatar_display_url = serializers.SerializerMethodField()
    resume_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = '__all__'

    def get_avatar_display_url(self, obj):
        url = obj.avatar_url or (obj.avatar.url if obj.avatar else '')
        if url and url.startswith('/media/'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
        return url

    def get_resume_display_url(self, obj):
        url = obj.resume_url or (obj.resume_file.url if obj.resume_file else '')
        if url and url.startswith('/media/'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
        return url


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
    gallery_display_images = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = '__all__'
        extra_kwargs = {
            'slug': {'required': False, 'allow_blank': True}
        }

    def get_thumbnail_display_url(self, obj):
        url = obj.thumbnail_url or (obj.thumbnail.url if obj.thumbnail else '')
        if url and url.startswith('/media/'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
        return url

    def get_gallery_display_images(self, obj):
        request = self.context.get('request')
        result = []
        for img in (obj.gallery_images or []):
            if isinstance(img, str) and img.startswith('/media/') and request:
                result.append(request.build_absolute_uri(img))
            else:
                result.append(img)
        return result


class ExperienceSerializer(serializers.ModelSerializer):
    company_logo_display_url = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = '__all__'

    def get_company_logo_display_url(self, obj):
        url = obj.company_logo_url or (obj.company_logo.url if obj.company_logo else '')
        if url and url.startswith('/media/'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
        return url

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
        url = obj.certificate_image_url or (obj.certificate_image.url if obj.certificate_image else '')
        if url and url.startswith('/media/'):
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(url)
        return url


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

from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from django.db.models import Count, Q
from .models import Profile, Project, ProjectImage, Experience, Education, Skill, Certification, Media
from .serializers import (
    ProfileSerializer, ProjectSerializer, ProjectImageSerializer,
    ExperienceSerializer, EducationSerializer, SkillSerializer,
    CertificationSerializer, MediaSerializer
)
from .permissions import IsAdminUserOrReadOnly
from .validators import validate_uploaded_file


class IsAdminUserOnly(permissions.BasePermission):
    """
    Permission class requiring authenticated staff or superuser access.
    Returns 401 for unauthenticated users and 403 for non-staff authenticated users.
    """
    message = "Administrative staff privileges are required to access this resource."

    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.is_staff or request.user.is_superuser)
        )


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def list(self, request, *args, **kwargs):
        profile = Profile.objects.first()
        if not profile:
            return Response({}, status=status.HTTP_200_OK)
        serializer = self.get_serializer(profile, context={'request': request})
        return Response(serializer.data)

    def perform_update(self, serializer):
        instance = serializer.save()
        if 'avatar_url' in self.request.data and instance.avatar:
            instance.avatar = None
            instance.save(update_fields=['avatar'])
        if 'resume_url' in self.request.data and instance.resume_file:
            instance.resume_file = None
            instance.save(update_fields=['resume_file'])


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminUserOrReadOnly]
    lookup_field = 'pk'

    def perform_update(self, serializer):
        instance = serializer.save()
        if 'thumbnail_url' in self.request.data and instance.thumbnail:
            instance.thumbnail = None
            instance.save(update_fields=['thumbnail'])

    def get_queryset(self):
        queryset = Project.objects.all()
        is_staff = self.request.user and self.request.user.is_authenticated and (self.request.user.is_staff or self.request.user.is_superuser)
        
        if not is_staff:
            queryset = queryset.filter(is_published=True)
        
        category = self.request.query_params.get('category', None)
        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category)

        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)

        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        is_staff = request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)
        if not is_staff and not instance.is_published:
            raise NotFound({'detail': 'Project not found.'})
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=False, methods=['get'], url_path='by-slug/(?P<slug>[^/.]+)')
    def get_by_slug(self, request, slug=None):
        is_staff = request.user and request.user.is_authenticated and (request.user.is_staff or request.user.is_superuser)
        try:
            if is_staff:
                project = Project.objects.get(slug=slug)
            else:
                project = Project.objects.get(slug=slug, is_published=True)
            serializer = self.get_serializer(project, context={'request': request})
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({'detail': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserOnly])
    def toggle_published(self, request, pk=None):
        project = self.get_object()
        project.is_published = not project.is_published
        project.save()
        return Response({'is_published': project.is_published, 'title': project.title})

    @action(detail=True, methods=['post'], permission_classes=[IsAdminUserOnly])
    def toggle_featured(self, request, pk=None):
        project = self.get_object()
        project.is_featured = not project.is_featured
        project.save()
        return Response({'is_featured': project.is_featured, 'title': project.title})


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminUserOrReadOnly]


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAdminUserOrReadOnly]


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def get_queryset(self):
        queryset = Skill.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset


class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    permission_classes = [IsAdminUserOrReadOnly]


class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [IsAdminUserOrReadOnly]

    def perform_create(self, serializer):
        file_obj = self.request.FILES.get('file')
        validate_uploaded_file(file_obj)
        file_size = file_obj.size if file_obj else 0
        file_type = file_obj.content_type if file_obj else 'unknown'
        title = self.request.data.get('title', file_obj.name if file_obj else '')
        serializer.save(file_size=file_size, file_type=file_type, title=title)


@api_view(['GET'])
@permission_classes([IsAdminUserOnly])
def dashboard_stats(request):
    from django.db import connection
    db_engine = connection.vendor  # 'postgresql' or 'sqlite'
    db_name = str(connection.settings_dict.get('NAME', 'unknown'))

    total_projects = Project.objects.count()
    published_projects = Project.objects.filter(is_published=True).count()
    draft_projects = Project.objects.filter(is_published=False).count()
    featured_projects = Project.objects.filter(is_featured=True).count()
    total_experience = Experience.objects.count()
    total_education = Education.objects.count()
    total_skills = Skill.objects.count()
    total_certifications = Certification.objects.count()
    total_media = Media.objects.count()

    recent_projects = ProjectSerializer(
        Project.objects.all()[:5], many=True, context={'request': request}
    ).data

    return Response({
        'database_engine': db_engine,
        'database_name': db_name.split('/')[-1] if '/' in db_name else db_name,
        'total_projects': total_projects,
        'published_projects': published_projects,
        'draft_projects': draft_projects,
        'featured_projects': featured_projects,
        'total_experience': total_experience,
        'total_education': total_education,
        'total_skills': total_skills,
        'total_certifications': total_certifications,
        'total_media': total_media,
        'recent_projects': recent_projects,
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def current_user(request):
    return Response({
        'username': request.user.username,
        'email': request.user.email,
        'is_staff': request.user.is_staff,
        'is_superuser': request.user.is_superuser
    })

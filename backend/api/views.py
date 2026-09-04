from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Q
from .models import Profile, Project, ProjectImage, Experience, Education, Skill, Certification, Media
from .serializers import (
    ProfileSerializer, ProjectSerializer, ProjectImageSerializer,
    ExperienceSerializer, EducationSerializer, SkillSerializer,
    CertificationSerializer, MediaSerializer
)

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class ProfileViewSet(viewsets.ModelViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    permission_classes = [IsAdminOrReadOnly]

    def list(self, request, *args, **kwargs):
        profile = Profile.objects.first()
        if not profile:
            profile = Profile.objects.create()
        serializer = self.get_serializer(profile, context={'request': request})
        return Response(serializer.data)


class ProjectViewSet(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    lookup_field = 'pk'

    def get_queryset(self):
        queryset = Project.objects.all()
        # If user is not logged in as admin, only show published projects
        if not (self.request.user and self.request.user.is_authenticated):
            queryset = queryset.filter(is_published=True)
        
        # Optional category filter
        category = self.request.query_params.get('category', None)
        if category and category.lower() != 'all':
            queryset = queryset.filter(category__iexact=category)

        # Optional featured filter
        featured = self.request.query_params.get('featured', None)
        if featured == 'true':
            queryset = queryset.filter(is_featured=True)

        return queryset

    @action(detail=False, methods=['get'], url_path='by-slug/(?P<slug>[^/.]+)')
    def get_by_slug(self, request, slug=None):
        try:
            if request.user and request.user.is_authenticated:
                project = Project.objects.get(slug=slug)
            else:
                project = Project.objects.get(slug=slug, is_published=True)
            serializer = self.get_serializer(project, context={'request': request})
            return Response(serializer.data)
        except Project.DoesNotExist:
            return Response({'detail': 'Project not found'}, status=status.HTTP_404_NOT_FOUND)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_published(self, request, pk=None):
        project = self.get_object()
        project.is_published = not project.is_published
        project.save()
        return Response({'is_published': project.is_published, 'title': project.title})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def toggle_featured(self, request, pk=None):
        project = self.get_object()
        project.is_featured = not project.is_featured
        project.save()
        return Response({'is_featured': project.is_featured, 'title': project.title})


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    permission_classes = [IsAdminOrReadOnly]


class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer
    permission_classes = [IsAdminOrReadOnly]


class SkillViewSet(viewsets.ModelViewSet):
    queryset = Skill.objects.all()
    serializer_class = SkillSerializer
    permission_classes = [IsAdminOrReadOnly]

    def get_queryset(self):
        queryset = Skill.objects.all()
        category = self.request.query_params.get('category', None)
        if category:
            queryset = queryset.filter(category__iexact=category)
        return queryset


class CertificationViewSet(viewsets.ModelViewSet):
    queryset = Certification.objects.all()
    serializer_class = CertificationSerializer
    permission_classes = [IsAdminOrReadOnly]


class MediaViewSet(viewsets.ModelViewSet):
    queryset = Media.objects.all()
    serializer_class = MediaSerializer
    permission_classes = [IsAdminOrReadOnly]

    def perform_create(self, serializer):
        file_obj = self.request.FILES.get('file')
        file_size = file_obj.size if file_obj else 0
        file_type = file_obj.content_type if file_obj else 'unknown'
        title = self.request.data.get('title', file_obj.name if file_obj else '')
        serializer.save(file_size=file_size, file_type=file_type, title=title)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def dashboard_stats(request):
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

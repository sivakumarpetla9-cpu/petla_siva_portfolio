import io
from django.test import TestCase
from django.contrib.auth.models import User
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APIClient
from rest_framework import status
from api.models import Profile, Project, Experience, Education, Skill, Certification, Media

class PortfolioAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()

        # 1. Staff Admin User
        self.admin_user = User.objects.create_user(
            username='admin_staff',
            email='admin@example.com',
            password='Password123!',
            is_staff=True,
            is_superuser=True
        )

        # 2. Regular Non-Staff User
        self.normal_user = User.objects.create_user(
            username='normal_user',
            email='normal@example.com',
            password='Password123!',
            is_staff=False,
            is_superuser=False
        )

        # 3. Sample Published Project
        self.published_project = Project.objects.create(
            title="Published Smart App",
            slug="published-smart-app",
            category="UI/UX Design",
            short_description="Public case study project",
            is_published=True,
            is_featured=True
        )

        # 4. Sample Draft Project
        self.draft_project = Project.objects.create(
            title="Secret Internal Draft",
            slug="secret-internal-draft",
            category="Frontend Development",
            short_description="Private draft project",
            is_published=False,
            is_featured=False
        )

    # 1. Anonymous Public GET
    def test_anonymous_public_get(self):
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should only list published projects
        titles = [p['title'] for p in response.data]
        self.assertIn("Published Smart App", titles)
        self.assertNotIn("Secret Internal Draft", titles)

    # 2. Anonymous Write Request Returns 401/403
    def test_anonymous_write_fails(self):
        response = self.client.post('/api/projects/', {
            'title': 'Hack Project',
            'short_description': 'Illegal create'
        })
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    # 3. Normal Authenticated Non-Staff User Cannot Modify CMS (Returns 403)
    def test_normal_user_write_returns_403(self):
        self.client.force_authenticate(user=self.normal_user)
        response = self.client.post('/api/projects/', {
            'title': 'Unauthorized Create',
            'short_description': 'Attempt'
        })
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    # 4. Admin Can Create Project
    def test_admin_can_create_project(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/projects/', {
            'title': 'New Admin Project',
            'short_description': 'Admin created project',
            'category': 'Full Stack',
            'is_published': True
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Project.objects.filter(title='New Admin Project').exists())

    # 5. Admin Can Update Project
    def test_admin_can_update_project(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.put(f'/api/projects/{self.published_project.id}/', {
            'title': 'Updated Smart App Title',
            'short_description': 'Updated description',
            'category': 'UI/UX Design',
            'is_published': True
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.published_project.refresh_from_db()
        self.assertEqual(self.published_project.title, 'Updated Smart App Title')

    # 6. Admin Can Delete Project
    def test_admin_can_delete_project(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.delete(f'/api/projects/{self.published_project.id}/')
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Project.objects.filter(id=self.published_project.id).exists())

    # 7. Draft Project Hidden From Public
    def test_draft_project_hidden_from_public(self):
        # GET by ID
        response_id = self.client.get(f'/api/projects/{self.draft_project.id}/')
        self.assertEqual(response_id.status_code, status.HTTP_404_NOT_FOUND)

        # GET by slug
        response_slug = self.client.get(f'/api/projects/by-slug/{self.draft_project.slug}/')
        self.assertEqual(response_slug.status_code, status.HTTP_404_NOT_FOUND)

    # 8. Published Project Visible
    def test_published_project_visible(self):
        response_slug = self.client.get(f'/api/projects/by-slug/{self.published_project.slug}/')
        self.assertEqual(response_slug.status_code, status.HTTP_200_OK)
        self.assertEqual(response_slug.data['title'], "Published Smart App")

    # 9. Media Upload Validation
    def test_media_upload_validation(self):
        self.client.force_authenticate(user=self.admin_user)

        # Valid PNG Image
        valid_file = SimpleUploadedFile("test_image.png", b"file_content", content_type="image/png")
        response_valid = self.client.post('/api/media/', {'file': valid_file, 'title': 'Test Image'})
        self.assertEqual(response_valid.status_code, status.HTTP_201_CREATED)

        # Invalid Executable Script
        invalid_file = SimpleUploadedFile("script.py", b"print('hack')", content_type="text/x-python")
        response_invalid = self.client.post('/api/media/', {'file': invalid_file, 'title': 'Hack Script'})
        self.assertEqual(response_invalid.status_code, status.HTTP_400_BAD_REQUEST)

    # 10. Dashboard Stats Requires Admin
    def test_dashboard_stats_requires_admin(self):
        # Anonymous
        response_anon = self.client.get('/api/admin/stats/')
        self.assertIn(response_anon.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

        # Normal User
        self.client.force_authenticate(user=self.normal_user)
        response_normal = self.client.get('/api/admin/stats/')
        self.assertEqual(response_normal.status_code, status.HTTP_403_FORBIDDEN)

        # Admin Staff User
        self.client.force_authenticate(user=self.admin_user)
        response_admin = self.client.get('/api/admin/stats/')
        self.assertEqual(response_admin.status_code, status.HTTP_200_OK)
        self.assertEqual(response_admin.data['total_projects'], 2)

    # 11. Authentication Token Endpoint Works
    def test_authentication_token_login(self):
        response = self.client.post('/api/auth/login/', {
            'username': 'admin_staff',
            'password': 'Password123!'
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

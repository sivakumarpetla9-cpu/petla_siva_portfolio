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

    # 12. Create Experience with Remote Work Mode (With and Without Location)
    def test_create_experience_remote(self):
        self.client.force_authenticate(user=self.admin_user)
        # Without location (optional for Remote)
        response = self.client.post('/api/experience/', {
            'company': 'SunSysTechSol Pvt. Ltd.',
            'role': 'UI/UX Designer Intern',
            'work_mode': 'Remote',
            'location': '',
            'start_date': '2026',
            'end_date': 'Present',
            'is_current': True,
            'description': 'Designing web flows and mobile components.'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['work_mode'], 'Remote')
        self.assertEqual(response.data['location'], '')

        # With optional location for Remote
        response2 = self.client.post('/api/experience/', {
            'company': 'SunSysTechSol Pvt. Ltd.',
            'role': 'UI/UX Designer Intern',
            'work_mode': 'Remote',
            'location': 'Eluru, Andhra Pradesh, India',
            'start_date': '2026',
            'end_date': 'Present',
            'is_current': True,
            'description': 'Designing web flows.'
        }, format='json')
        self.assertEqual(response2.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response2.data['work_mode'], 'Remote')
        self.assertEqual(response2.data['location'], 'Eluru, Andhra Pradesh, India')

    # 13. Create Experience with On-site Work Mode & Location
    def test_create_experience_onsite(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/experience/', {
            'company': 'Tech Corp',
            'role': 'Frontend Developer',
            'work_mode': 'On-site',
            'location': 'Hyderabad, Telangana, India',
            'start_date': '2026',
            'end_date': 'Present',
            'is_current': True,
            'description': 'Building scalable frontend applications.'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['work_mode'], 'On-site')
        self.assertEqual(response.data['location'], 'Hyderabad, Telangana, India')

    # 14. On-site Requires Location (400 if empty)
    def test_onsite_requires_location(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/experience/', {
            'company': 'Tech Corp',
            'role': 'Frontend Developer',
            'work_mode': 'On-site',
            'location': '',
            'start_date': '2026',
            'description': 'Missing location'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('location', response.data)

    # 15. Create Experience with Hybrid Work Mode & Location
    def test_create_experience_hybrid(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/experience/', {
            'company': 'ABC Technologies',
            'role': 'Frontend Developer Intern',
            'work_mode': 'Hybrid',
            'location': 'Bengaluru, Karnataka, India',
            'start_date': '2026',
            'end_date': 'Present',
            'is_current': True,
            'description': 'Hybrid design and frontend engineering.'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['work_mode'], 'Hybrid')
        self.assertEqual(response.data['location'], 'Bengaluru, Karnataka, India')

    # 16. Hybrid Requires Location (400 if empty)
    def test_hybrid_requires_location(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/experience/', {
            'company': 'ABC Technologies',
            'role': 'Frontend Developer',
            'work_mode': 'Hybrid',
            'location': '   ',
            'start_date': '2026',
            'description': 'Missing location'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('location', response.data)

    # 17. Invalid Work Mode Validation Fails (400)
    def test_invalid_work_mode_rejected(self):
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.post('/api/experience/', {
            'company': 'Invalid Mode Corp',
            'role': 'Developer',
            'work_mode': 'InvalidMode',
            'location': 'Anywhere',
            'start_date': '2026',
            'description': 'Testing validation rejection'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('work_mode', response.data)

    # 18. Update Experience Work Mode and Location
    def test_update_experience_work_mode(self):
        self.client.force_authenticate(user=self.admin_user)
        exp = Experience.objects.create(
            company='Orig Corp',
            role='Designer',
            work_mode='Remote',
            location='',
            start_date='2025',
            description='Original desc'
        )
        response = self.client.put(f'/api/experience/{exp.id}/', {
            'company': 'Orig Corp',
            'role': 'Senior Designer',
            'work_mode': 'Hybrid',
            'location': 'Hyderabad, Telangana, India',
            'start_date': '2025',
            'end_date': 'Present',
            'is_current': True,
            'description': 'Updated desc'
        }, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        exp.refresh_from_db()
        self.assertEqual(exp.work_mode, 'Hybrid')
        self.assertEqual(exp.location, 'Hyderabad, Telangana, India')

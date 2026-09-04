import React, { useState, useEffect } from 'react';
import Navbar from '../../components/public/Navbar';
import HeroSection from '../../components/public/HeroSection';
import AboutSection from '../../components/public/AboutSection';
import SkillsSection from '../../components/public/SkillsSection';
import ProjectsSection from '../../components/public/ProjectsSection';
import ExperienceSection from '../../components/public/ExperienceSection';
import EducationSection from '../../components/public/EducationSection';
import CertificationsSection from '../../components/public/CertificationsSection';
import ContactSection from '../../components/public/ContactSection';
import Footer from '../../components/public/Footer';
import {
  fetchProfile, fetchProjects, fetchExperiences,
  fetchEducation, fetchSkills, fetchCertifications
} from '../../api/client';

export default function HomePage() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [profData, projData, expData, eduData, skillData, certData] = await Promise.all([
          fetchProfile().catch(() => null),
          fetchProjects().catch(() => []),
          fetchExperiences().catch(() => []),
          fetchEducation().catch(() => []),
          fetchSkills().catch(() => []),
          fetchCertifications().catch(() => []),
        ]);

        if (profData) setProfile(profData);
        setProjects(projData);
        setExperiences(expData);
        setEducation(eduData);
        setSkills(skillData);
        setCertifications(certData);
      } catch (err) {
        console.error('Error loading portfolio data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0d14] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 animate-spin flex items-center justify-center p-1">
            <div className="w-full h-full bg-[#0a0d14] rounded-xl"></div>
          </div>
          <span className="text-gray-400 text-sm font-medium">Loading portfolio...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0d14] text-gray-100 font-sans">
      <Navbar profile={profile} />
      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <SkillsSection skills={skills} />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <EducationSection education={education} />
        <CertificationsSection certifications={certifications} />
        <ContactSection profile={profile} />
      </main>
      <Footer profile={profile} />
    </div>
  );
}

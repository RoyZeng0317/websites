/**
 * HomePage — React version of index.html
 *
 * Auth integration requires the firebase npm package:
 *   npm install firebase
 * Then uncomment the auth imports in this file.
 *
 * For now, auth callbacks are no-ops so the UI can be previewed without Firebase.
 */

import { useState } from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import SkillsSection from '../components/SkillsSection';
import CoursesGrid from '../components/CoursesGrid';
import LoginModal from '../components/LoginModal';
import Footer from '../components/Footer';
import { useTheme } from '../hooks/useTheme';

export default function HomePage() {
  const { icon, toggle } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);

  // TODO: Replace these with real Firebase auth calls after running `npm install firebase`
  const handleGoogleSignIn = async () => {
    console.warn('Google sign-in: wire up Firebase auth here');
  };
  const handleEmailSignIn = async (_email: string, _password: string) => {
    console.warn('Email sign-in: wire up Firebase auth here');
  };
  const handleEmailSignUp = async (_email: string, _password: string) => {
    console.warn('Email sign-up: wire up Firebase auth here');
  };

  return (
    <>
      <NavBar
        user={null}
        onSignIn={() => setModalOpen(true)}
        onSignUp={() => setModalOpen(true)}
        onSignOut={() => {}}
        onThemeToggle={toggle}
        themeIcon={icon}
      />

      <Hero
        onStartLearning={() => setModalOpen(true)}
        onCheckLevel={() => {
          // Trigger the CEFR test — kept in vanilla test.js for now
          document.getElementById('test-overlay')?.classList.add('open');
        }}
      />

      <StatsBar />

      <SkillsSection />

      <CoursesGrid />

      <Footer />

      <LoginModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onGoogleSignIn={handleGoogleSignIn}
        onEmailSignIn={handleEmailSignIn}
        onEmailSignUp={handleEmailSignUp}
      />
    </>
  );
}

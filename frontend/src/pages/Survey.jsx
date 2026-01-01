import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import SurveyCardStack from '../components/SurveyCardStack';
import API from '../utils/apiClient';
import { normalizeSlug } from '../utils/slugUtils';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

export default function SurveyPage() {
  const [searchParams] = useSearchParams();
  const { installationSlug } = useParams(); // For /:slug route
  const rawId = searchParams.get('id') || searchParams.get('installationId');

  const [installationData, setInstallationData] = useState(null);
  const [loadingInstallation, setLoadingInstallation] = useState(true);

  // Normalize slug to handle case sensitivity
  const normalizedSlug = installationSlug ? normalizeSlug(installationSlug) : null;

  // Determine which identifier we're using
  const identifier = normalizedSlug || rawId;
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch installation data and questions
  useEffect(() => {
    const fetchInstallationAndQuestions = async () => {
      if (!identifier) {
        console.error('No installation identifier provided');
        navigate('/installation-selection');
        return;
      }

      try {
        // SIMPLE FIX: Fetch installations directly from Firestore (no backend dependency)
        // Deployed backend is missing multiple endpoints, so bypass it entirely for installation lookup
        console.log('Fetching installations from Firestore for identifier:', identifier);
        
        const installationsRef = collection(db, 'installations');
        const snapshot = await getDocs(installationsRef);
        const installations = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        console.log('Fetched installations from Firestore:', installations);

        // Find matching installation by numericId (from QR code) or slug (from URL)
        const installation = installations.find(inst =>
          inst.numericId === identifier ||
          inst.slug === identifier ||
          inst.id === identifier
        );

        if (!installation) {
          console.error('Installation not found matching identifier:', identifier);
          navigate('/installation-selection');
          return;
        }

        setInstallationData(installation);
        console.log('Loaded installation:', installation);

        // Skip canonical redirect - just load the survey

        // Fetch questions using the slug
        const questionsResponse = await API.get(`/survey-questions?installationId=${installation.slug}`);
        console.log('Fetched questions for installation:', installation.slug, questionsResponse.data);
        setQuestions(questionsResponse.data || []);

      } catch (err) {
        console.error('Error fetching installation or questions:', err);
        setQuestions([]);
      } finally {
        setLoading(false);
        setLoadingInstallation(false);
      }
    };

    fetchInstallationAndQuestions();
  }, [identifier, navigate]);

  const handleSurveyComplete = async (answers) => {
    if (!installationData) return;

    try {
      await API.post('/submit-survey', {
        installationId: installationData.numericId || installationData.id, // Use numericId for backward compatibility
        installationSlug: installationData.slug,
        responses: answers
      });
      navigate('/survey-complete');
    } catch (err) {
      console.error('Error submitting survey:', err);
      // Still navigate to thank you page even if submission fails
      navigate('/survey-complete');
    }
  };

  const handleQuickExit = () => {
    // Clear any cached responses
    setQuestions([]);
    // Navigate back to landing page
    navigate('/');
  };

  if (loading || loadingInstallation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vai-white">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-vai-orange border-t-transparent mb-4"></div>
          <p className="text-vai-grayText font-medium">Loading survey...</p>
        </div>
      </div>
    );
  }

  if (!installationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vai-white">
        <div className="text-center">
          <p className="text-vai-grayText font-medium mb-4">Installation not found</p>
          <button
            onClick={() => navigate('/installation-selection')}
            className="text-vai-orange hover:underline"
          >
            Return to installation selection
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vai-white">
        <p className="text-vai-black font-inter text-lg">No survey questions available for this installation.</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Quick Exit Button */}
      <button
        onClick={handleQuickExit}
        className="absolute top-4 right-4 z-50 text-xs text-gray-400 hover:text-[#8B2635] transition-colors duration-200 font-medium"
      >
        Quick Exit
      </button>

      <SurveyCardStack
        questions={questions}
        onComplete={handleSurveyComplete}
      />
    </div>
  );
}

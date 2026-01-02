import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import SurveyCardStack from '../components/SurveyCardStack';
import API from '../utils/apiClient';
import { normalizeSlug } from '../utils/slugUtils';

// Fallback questions for resilience when API fails
const fallbackQuestions = [
  {
    id: 'q1',
    question: 'How did this installation make you feel?',
    type: 'multiple-choice',
    options: ['Happy', 'Inspired', 'Curious', 'Peaceful', 'Other']
  },
  {
    id: 'q2',
    question: 'What aspects of this installation stood out to you?',
    type: 'checkbox',
    options: ['Visual design', 'Interactive elements', 'Location', 'Message/meaning', 'Technical innovation']
  },
  {
    id: 'q3',
    question: 'Would you recommend this installation to others?',
    type: 'rating',
    scale: 5
  }
];

export default function SurveyPage() {
  const [searchParams] = useSearchParams();
  const { installationSlug } = useParams(); // For /:slug route
  const rawId = searchParams.get('id') || searchParams.get('installationId');

  const [installationData, setInstallationData] = useState(null);
  const [loadingInstallation, setLoadingInstallation] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Normalize slug to handle case sensitivity
  const normalizedSlug = installationSlug ? normalizeSlug(installationSlug) : null;

  // Determine which identifier we're using
  const identifier = normalizedSlug || rawId;
  console.log('Survey page - rawId:', rawId, 'installationSlug:', installationSlug, 'normalizedSlug:', normalizedSlug, 'final identifier:', identifier);
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
        // Fetch installation by slug or numericId
        const installationResponse = await API.get(`/installation-by-identifier/${identifier}`);
        const installation = installationResponse.data;

        if (!installation) {
          console.error('Installation not found');
          navigate('/installation-selection');
          return;
        }

        setInstallationData(installation);
        console.log('Loaded installation:', installation);
        console.log('Installation identifiers - numericId:', installation.numericId, 'id:', installation.id, 'slug:', installation.slug);

        // Canonical URL redirect: If accessed via numeric ID, redirect to slug
        if (rawId && installation.slug && !installationSlug) {
          console.log('Redirecting to canonical slug URL:', installation.slug);
          navigate(`/${installation.slug}`, { replace: true });
        }

        // Determine Firestore document ID for logging/analytics
        // Per instructions: "installationId must match the Firestore document ID"
        const firestoreDocId = installation.id || installation.numericId;
        console.log('Using Firestore document ID for questions:', firestoreDocId);

        // Questions are stored directly on the installation document in Firestore
        // via the `surveyQuestions` array field (architecture source of truth).
        const fetchedQuestions = Array.isArray(installation.surveyQuestions)
          ? installation.surveyQuestions
          : [];

        // Use fallback questions if no questions are defined on the installation
        if (fetchedQuestions.length === 0) {
          console.warn('No surveyQuestions found on installation, using fallback questions');
          setQuestions(fallbackQuestions);
        } else {
          setQuestions(fetchedQuestions);
        }

      } catch (err) {
        console.error('Error fetching installation or questions:', err);
        // Set specific error message based on error type
        if (err.response?.status === 404) {
          setFetchError('Installation not found');
        } else if (err.response?.status >= 500) {
          setFetchError('Server error - please try again later');
        } else if (!navigator.onLine) {
          setFetchError('Network connection error');
        } else {
          setFetchError('Unable to load installation data');
        }
        // Use fallback questions even on installation fetch error for better UX
        console.warn('Installation fetch failed, using fallback questions');
        setQuestions(fallbackQuestions);
      } finally {
        setLoading(false);
        setLoadingInstallation(false);
      }
    };

    fetchInstallationAndQuestions();
  }, [identifier, rawId, installationSlug, navigate]);

  const handleSurveyComplete = async (answers) => {
    if (!installationData) return;
    try {
      // Use Firestore document ID as per system requirements
      const firestoreDocId = installationData.id || installationData.numericId;
      console.log('Submitting survey for installation ID:', firestoreDocId);
      await API.post('/submit-survey', {
        installationId: firestoreDocId,
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

  if (fetchError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vai-white">
        <div className="text-center">
          <p className="text-vai-grayText font-medium mb-4">{fetchError}</p>
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
        <div className="text-center">
          <p className="text-vai-grayText font-medium mb-4">No survey questions available for this installation.</p>
          <button
            onClick={() => {
              console.log('Loading fallback questions');
              setQuestions(fallbackQuestions);
            }}
            className="text-vai-orange hover:underline mr-4"
          >
            Load default survey
          </button>
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

import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import SurveyCardStack from '../components/SurveyCardStack';
import API from '../utils/apiClient';
import surveyQuestions from '../data/surveyQuestions';

export default function SurveyPage() {
  const [searchParams] = useSearchParams();
  const installationId = searchParams.get('id') || '1';
  const navigate = useNavigate();

  const handleSurveyComplete = async (answers) => {
    try {
      await API.post('/submit-survey', {
        installationId,
        responses: answers,
      });
      navigate('/survey-complete');
    } catch (err) {
      console.error('Error submitting survey:', err);
      // Still navigate to thank you page even if submission fails
      navigate('/survey-complete');
    }
  };

  return (
    <SurveyCardStack
      questions={surveyQuestions}
      onComplete={handleSurveyComplete}
    />
  );
}

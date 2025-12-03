import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export default function Errors() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    stepsToReproduce: '',
    priority: 'medium',
    screenshot: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, screenshot: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('stepsToReproduce', formData.stepsToReproduce);
      formDataToSend.append('priority', formData.priority);
      if (formData.screenshot) {
        formDataToSend.append('screenshot', formData.screenshot);
      }

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/submit-bug-report`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitMessage('✅ Bug report submitted successfully! Our team will review it soon.');
        setFormData({
          title: '',
          description: '',
          stepsToReproduce: '',
          priority: 'medium',
          screenshot: null
        });
        // Reset file input
        document.getElementById('screenshot-input').value = '';
      } else {
        setSubmitMessage('❌ Failed to submit bug report. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting bug report:', error);
      setSubmitMessage('❌ An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="flex items-center gap-2 mb-2">
          <span className="text-vai-orange">🐛</span>
          Bug Report
        </h1>
        <p className="text-vai-grayText font-sans">
          Found a bug? Help us improve by reporting issues you encounter.
        </p>
      </div>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Bug Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Brief description of the bug"
            required
          />

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-vai-black mb-2 font-sans">
              Description <span className="text-vai-orange">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-vai-grayLight rounded-lg focus:outline-none focus:ring-2 focus:ring-vai-orange font-sans"
              placeholder="Detailed description of the bug..."
              required
            />
          </div>

          <div>
            <label htmlFor="stepsToReproduce" className="block text-sm font-medium text-vai-black mb-2 font-sans">
              Steps to Reproduce <span className="text-vai-orange">*</span>
            </label>
            <textarea
              id="stepsToReproduce"
              name="stepsToReproduce"
              value={formData.stepsToReproduce}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-vai-grayLight rounded-lg focus:outline-none focus:ring-2 focus:ring-vai-orange font-sans"
              placeholder="1. Go to...&#10;2. Click on...&#10;3. See error..."
              required
            />
          </div>

          <Select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleInputChange}
            options={[
              { value: 'low', label: 'Low - Minor issue' },
              { value: 'medium', label: 'Medium - Affects functionality' },
              { value: 'high', label: 'High - Blocks critical features' },
              { value: 'critical', label: 'Critical - System down' }
            ]}
          />

          <div>
            <label htmlFor="screenshot-input" className="block text-sm font-medium text-vai-black mb-2 font-sans">
              Screenshot (Optional)
            </label>
            <input
              id="screenshot-input"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm font-sans text-vai-grayText
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium file:font-sans
                file:bg-vai-orange file:text-white
                hover:file:bg-vai-orange/90
                file:cursor-pointer cursor-pointer"
            />
            {formData.screenshot && (
              <p className="mt-2 text-sm text-vai-green font-sans">
                ✓ {formData.screenshot.name}
              </p>
            )}
          </div>

          {submitMessage && (
            <div className={`p-4 rounded-lg ${submitMessage.startsWith('✅') ? 'bg-vai-green/10 text-vai-green' : 'bg-red-50 text-red-600'} font-sans`}>
              {submitMessage}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Submitting...' : '📧 Submit Bug Report'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                title: '',
                description: '',
                stepsToReproduce: '',
                priority: 'medium',
                screenshot: null
              })}
            >
              Clear
            </Button>
          </div>
        </form>
      </Card>

      <div className="mt-6 p-4 bg-vai-bluePale/20 rounded-lg border border-vai-blueLight">
        <p className="text-sm text-vai-grayText font-sans">
          <strong>Note:</strong> Your bug report will be sent to <span className="text-vai-orange font-medium">vaiteam65800@gmail.com</span>.
          We typically respond within 24-48 hours.
        </p>
      </div>
    </div>
  );
}

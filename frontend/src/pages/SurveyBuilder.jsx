import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CircleDot, CheckSquare, Star, Type, Image as ImageIcon, Send, Trash2, Clipboard } from 'lucide-react';

export default function SurveyBuilder() {
  const [eventData, setEventData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    heroImage: null
  });
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [previewHeroUrl, setPreviewHeroUrl] = useState(null);

  // Sample assets from Survey Creation Suite folder
  const assetImages = [
    '/Survey Creation Suite/Transparent.avif',
    '/Survey Creation Suite/NYC Event.avif',
    '/Survey Creation Suite/Video G.svg',
    '/Survey Creation Suite/place_holder.svg',
    '/Survey Creation Suite/cte_bg.svg',
    '/Survey Creation Suite/Hero_g.svg',
    '/Survey Creation Suite/dots.svg',
    '/Survey Creation Suite/rich_result.svg'
  ];

  // Available question types
  const questionBank = [
    { id: 'multiple-choice', name: 'Multiple Choice', icon: CircleDot, type: 'radio' },
    { id: 'checkbox', name: 'Checkboxes', icon: CheckSquare, type: 'checkbox' },
    { id: 'rating-scale', name: 'Rating Scale (1-5)', icon: Star, type: 'rating' },
    { id: 'text-short', name: 'Short Text', icon: Type, type: 'text' },
  ];

  const handleImageSelect = (imagePath) => {
    setEventData(prev => ({ ...prev, heroImage: imagePath }));
    setPreviewHeroUrl(imagePath);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewHeroUrl(url);
      setEventData(prev => ({ ...prev, heroImage: file }));
    }
  };

  const addQuestion = (questionType) => {
    const newQuestion = {
      id: Date.now(),
      type: questionType.type,
      label: questionType.name,
      question: '',
      options: questionType.type === 'radio' || questionType.type === 'checkbox' ? ['', '', ''] : []
    };
    setSelectedQuestions([...selectedQuestions, newQuestion]);
  };

  const updateQuestion = (id, field, value) => {
    setSelectedQuestions(selectedQuestions.map(q =>
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const removeQuestion = (id) => {
    setSelectedQuestions(selectedQuestions.filter(q => q.id !== id));
  };

  const handlePublish = () => {
    const eventId = `event-${Date.now()}`;
    console.log('Publishing event:', { eventId, eventData, selectedQuestions });
    alert(`Event published! ID: ${eventId}\n\nSurvey link: /installation-selection?id=${eventId}`);
  };

  return (
    <div className="h-screen flex overflow-hidden bg-vai-white">
      {/* Left Panel - Asset Selector */}
      <div className="w-64 border-r border-vai-grayLight overflow-y-auto bg-white p-4">
        <h3 className="mb-4 flex items-center gap-2">
          <span>🖼️</span>
          <span>Assets</span>
        </h3>

        <div className="space-y-2 mb-6">
          <label className="block text-sm font-sans font-medium text-vai-black mb-2">
            Upload Custom Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-xs font-sans text-vai-grayText
              file:mr-2 file:py-1.5 file:px-3
              file:rounded file:border-0
              file:text-xs file:font-medium
              file:bg-vai-orange file:text-white
              hover:file:bg-vai-orange/90
              file:cursor-pointer cursor-pointer"
          />
        </div>

        <div className="border-t border-vai-grayLight pt-4 mt-4">
          <p className="text-xs font-sans font-medium text-vai-grayText mb-3">ASSET BANK</p>
          <div className="grid grid-cols-2 gap-2">
            {assetImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => handleImageSelect(img)}
                className="border-2 border-vai-grayLight hover:border-vai-orange rounded-lg p-2 transition-colors aspect-square flex items-center justify-center overflow-hidden bg-gray-50"
              >
                <img
                  src={img}
                  alt={`Asset ${idx + 1}`}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23E1E0E1" width="100" height="100"/%3E%3Ctext fill="%23888" font-size="12" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage%3C/text%3E%3C/svg%3E';
                  }}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-vai-grayLight pt-4 mt-4">
          <p className="text-xs font-sans font-medium text-vai-grayText mb-3">QUESTION BANK</p>
          <div className="space-y-2">
            {questionBank.map((q) => {
              const IconComponent = q.icon;
              return (
                <button
                  key={q.id}
                  onClick={() => addQuestion(q)}
                  className="w-full text-left px-3 py-2 rounded-lg border border-vai-grayLight hover:bg-vai-bluePale/40 hover:border-vai-orange transition-colors flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4 text-vai-black" />
                  <span className="text-sm font-sans">{q.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Middle Panel - Canvas */}
      <div className="flex-1 overflow-y-auto p-8 bg-vai-bluePale/10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="flex items-center justify-between mb-6">
            <h1>Survey Builder</h1>
            <Button variant="primary" onClick={handlePublish} className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              Publish Event
            </Button>
          </div>

          <Card title="Event Design">
            {/* Hero Image Preview */}
            <div className="mb-6">
              <label className="block text-sm font-sans font-medium text-vai-black mb-2">
                Hero Image
              </label>
              <div className="w-full aspect-[16/9] bg-vai-bluePale/20 rounded-lg border-2 border-dashed border-vai-grayLight flex items-center justify-center overflow-hidden">
                {previewHeroUrl ? (
                  <img
                    src={previewHeroUrl}
                    alt="Hero preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center text-vai-grayText font-sans">
                    <p className="text-4xl mb-2">🖼️</p>
                    <p className="text-sm">Select or upload a hero image</p>
                  </div>
                )}
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-4">
              <Input
                label="Event Title"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="New York City Executive Summit"
              />

              <div>
                <label className="block text-sm font-sans font-medium text-vai-black mb-2">
                  Event Description
                </label>
                <textarea
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-vai-grayLight rounded-lg focus:outline-none focus:ring-2 focus:ring-vai-orange font-sans"
                  placeholder="Join us for an exclusive event..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Location"
                  value={eventData.location}
                  onChange={(e) => setEventData({ ...eventData, location: e.target.value })}
                  placeholder="9 East 1st Street, New York"
                />
                <Input
                  label="Date & Time"
                  type="datetime-local"
                  value={eventData.date}
                  onChange={(e) => setEventData({ ...eventData, date: e.target.value })}
                />
              </div>
            </div>
          </Card>

          {/* Survey Questions */}
          {selectedQuestions.length > 0 && (
            <Card title="Survey Questions">
              <div className="space-y-4">
                {selectedQuestions.map((q, index) => (
                  <div key={q.id} className="p-4 bg-vai-bluePale/20 rounded-lg border border-vai-grayLight">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-sans font-medium text-vai-grayText">Q{index + 1}</span>
                        <span className="text-sm font-sans px-2 py-1 bg-vai-orange/10 text-vai-orange rounded">{q.label}</span>
                      </div>
                      <button
                        onClick={() => removeQuestion(q.id)}
                        className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove
                      </button>
                    </div>
                    <Input
                      label="Question Text"
                      value={q.question}
                      onChange={(e) => updateQuestion(q.id, 'question', e.target.value)}
                      placeholder="Enter your question..."
                    />
                    {(q.type === 'radio' || q.type === 'checkbox') && (
                      <div className="mt-3">
                        <label className="block text-sm font-sans font-medium text-vai-black mb-2">Options</label>
                        {q.options.map((opt, optIdx) => (
                          <input
                            key={optIdx}
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const newOptions = [...q.options];
                              newOptions[optIdx] = e.target.value;
                              updateQuestion(q.id, 'options', newOptions);
                            }}
                            placeholder={`Option ${optIdx + 1}`}
                            className="w-full px-3 py-2 mb-2 border border-vai-grayLight rounded-lg focus:outline-none focus:ring-2 focus:ring-vai-orange font-sans"
                          />
                        ))}
                        <button
                          onClick={() => {
                            const newOptions = [...q.options, ''];
                            updateQuestion(q.id, 'options', newOptions);
                          }}
                          className="text-sm text-vai-orange hover:text-vai-orange/80 font-sans"
                        >
                          + Add Option
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {selectedQuestions.length === 0 && (
            <div className="text-center py-12 text-vai-grayText font-sans">
              <Clipboard className="w-16 h-16 mx-auto mb-4 text-vai-grayText" strokeWidth={1.5} />
              <p>Add questions from the question bank on the left</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

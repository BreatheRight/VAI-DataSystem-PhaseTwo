import React from 'react';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';

export default function Settings() {
  const settingsSections = [
    {
      title: 'User Profile',
      icon: '👤',
      description: 'Manage your personal information, email, and account details'
    },
    {
      title: 'Notification Preferences',
      icon: '🔔',
      description: 'Configure email alerts, system notifications, and data update frequencies'
    },
    {
      title: 'Data Export Options',
      icon: '💾',
      description: 'Customize CSV/PDF export formats, scheduled reports, and data retention'
    },
    {
      title: 'Security & Privacy',
      icon: '🔒',
      description: 'Password management, two-factor authentication, session timeout settings'
    },
    {
      title: 'Display Preferences',
      icon: '🎨',
      description: 'Theme customization, chart color schemes, and dashboard layout options'
    },
    {
      title: 'Language & Region',
      icon: '🌍',
      description: 'Interface language, date formats, time zones, and regional settings'
    }
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-semibold text-vai-black mb-1">⚙️ Settings</h1>
        <p className="text-vai-grayText">
          Manage your dashboard preferences and account settings
        </p>
      </div>

      {/* Coming Soon Notice */}
      <Card>
        <div className="text-center p-6 bg-vai-blueLight/20 rounded-lg border-2 border-vai-blueLight">
          <h2 className="mb-2 text-vai-black">Settings Coming Soon</h2>
          <p className="text-vai-grayText">
            We're working on building comprehensive settings to customize your dashboard experience.
          </p>
        </div>
      </Card>

      {/* Account Information (Demo Form) */}
      <Card title="Account Information">
        <div className="space-y-4 max-w-xl">
          <Input label="Display Name" placeholder="Your name" defaultValue="Admin User" />
          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            defaultValue="admin@vanalen.org"
            disabled
          />
          <Select
            label="Language Preference"
            options={[
              { value: 'en', label: 'English' },
              { value: 'es', label: 'Español (Coming Soon)' }
            ]}
            defaultValue="en"
          />
          <div className="pt-2">
            <Button variant="primary">Save Changes</Button>
          </div>
        </div>
      </Card>

      {/* Planned Settings Sections */}
      <div>
        <h2 className="mb-4">Planned Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {settingsSections.map((section, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <div className="flex gap-4">
                <div className="text-4xl" aria-hidden="true">{section.icon}</div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-vai-black mb-1">
                    {section.title}
                  </h3>
                  <p className="text-sm text-vai-grayText leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

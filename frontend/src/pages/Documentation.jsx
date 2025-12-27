import React from 'react';
import { Card } from '../ui/Card';

export default function Documentation() {
  return (
    <div className="p-6 max-w-5xl mx-auto">
      <Card>
        <div className="max-w-none space-y-6">
          {/* Header */}
          <div className="mb-6">
            <h1 className="mb-2">Admin Dashboard Documentation</h1>
            <p className="text-lg text-vai-grayText">
              Complete guide to analyzing community engagement data
            </p>
          </div>

          <hr className="border-vai-grayLight" />

          {/* Getting Started */}
          <section className="space-y-3">
            <h2>Getting Started</h2>
            <p className="text-vai-black leading-relaxed">
              The Van Alen Institute Admin Dashboard provides real-time analytics for survey responses
              collected from public art installations. Use the sidebar navigation to explore different
              sections of the platform.
            </p>
          </section>

          {/* Dashboard Section */}
          <section className="space-y-3">
            <h2>Dashboard</h2>
            <p className="leading-relaxed">
              The main analytics view displays survey data through interactive visualizations and key metrics.
            </p>

            <h3 className="mt-6 mb-3">Features</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong>Executive KPIs:</strong> View total responses, average sentiment scores, and installation-specific counts
              </li>
              <li>
                <strong>7-Day Attendance Trend:</strong> Track daily response patterns over the past week to identify trends
              </li>
              <li>
                <strong>Installation Comparison:</strong> Compare response volume and sentiment between installations
              </li>
              <li>
                <strong>Advanced Analytics:</strong> Click the expand icon on any chart to view detailed demographic and question-level breakdowns
              </li>
            </ul>
          </section>

          {/* Table View Section */}
          <section className="space-y-3">
            <h2>Table View</h2>
            <p className="leading-relaxed">
              Access detailed tabular data with sorting and filtering capabilities.
            </p>

            <h3 className="mt-6 mb-3">Functionality</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sort by submission date, installation, or sentiment scores</li>
              <li>Filter responses by installation or date range</li>
              <li>Color-coded sentiment indicators (green for positive scores ≥4)</li>
            </ul>
          </section>

          {/* Event Manager Section */}
          <section className="space-y-3">
            <h2>Event Manager</h2>
            <p className="leading-relaxed">
              Manage installations and view quick statistics for each location.
            </p>

            <h3 className="mt-6 mb-3">Available Actions</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>Generate QR codes for survey access</li>
              <li>View installation-specific analytics</li>
              <li>Edit installation details and metadata</li>
            </ul>
          </section>

          {/* Filters Section */}
          <section className="space-y-3">
            <h2>Using Filters</h2>
            <p className="leading-relaxed">
              Refine your data analysis by applying filters to focus on specific installations or time periods.
            </p>

            <div className="bg-vai-bluePale/40 p-4 rounded-lg mt-4 border-l-4 border-vai-orange">
              <p className="leading-relaxed">
                <strong>Installation Filter:</strong> Select "All Installations", "Breathing Pavilion", "Common Ground", or "Los Circulos"
              </p>
            </div>
          </section>

          {/* Understanding Sentiment Section */}
          <section className="space-y-3">
            <h2>Understanding Sentiment Scores</h2>
            <p className="leading-relaxed">
              Sentiment is calculated as an average across four key metrics (scale 1-5):
            </p>

            <ol className="list-decimal pl-6 space-y-2">
              <li>How welcome do you feel on this site?</li>
              <li>How safe do you feel on this site?</li>
              <li>How comfortable do you feel on this site?</li>
              <li>How positive is your overall experience?</li>
            </ol>
          </section>

          {/* Best Practices Section */}
          <section className="space-y-3">
            <h2>Best Practices</h2>

            <div className="bg-vai-blueLight/40 p-6 rounded-lg border border-vai-blueLight">
              <ul className="list-disc pl-6 space-y-2">
                <li>Check the 7-day trend chart daily to monitor attendance patterns</li>
                <li>Use advanced analytics (expand icon) for detailed demographic insights</li>
                <li>Download reports regularly for presentations and stakeholder updates</li>
                <li>Compare sentiment scores between installations to identify successful design patterns</li>
              </ul>
            </div>
          </section>

          <hr className="border-vai-grayLight my-8" />

          {/* Footer */}
          <div className="text-center py-6">
            <p className="text-vai-grayText">
              For technical support or questions, contact the Van Alen Institute development team.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

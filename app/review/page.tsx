"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface ProfileData {
  [key: string]: {
    question: string;
    answer: string;
    followUp?: string;
    category: string;
  };
}

export default function ReviewPage() {
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempAnswer, setTempAnswer] = useState("");

  // Fetch profile data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const sessionId = localStorage.getItem('onboardingSessionId');
        if (!sessionId) {
          console.error('No session ID found');
          return;
        }

        const res = await fetch(`/api/profile?sessionId=${sessionId}`);
        if (!res.ok) {
          console.error('Failed to fetch profile data');
          return;
        }

        const data = await res.json();
        if (data.profileData) {
          setProfileData(data.profileData);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, []);

  const getCategoryColor = (category: string) => {
    const colors = {
      BASIC: "bg-blue-100 text-blue-800",
      MARKET: "bg-green-100 text-green-800",
      PRODUCT: "bg-orange-100 text-orange-800",
      BUSINESS: "bg-amber-100 text-amber-800",
      VALIDATION: "bg-red-100 text-red-800"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const handleEdit = (fieldId: string, currentAnswer: string) => {
    setEditingField(fieldId);
    setTempAnswer(currentAnswer);
  };

  const handleSave = (fieldId: string) => {
    setProfileData(prev => ({
      ...prev,
      [fieldId]: {
        ...prev[fieldId],
        answer: tempAnswer
      }
    }));
    setEditingField(null);
    setTempAnswer("");
  };

  const handleCancel = () => {
    setEditingField(null);
    setTempAnswer("");
  };

  const handleSubmit = async () => {
    try {
      const sessionId = localStorage.getItem('onboardingSessionId');
      if (!sessionId) {
        console.error('No session ID found');
        return;
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, profileData }),
      });

      if (!res.ok) {
        console.error('Failed to submit profile data');
        return;
      }

      const data = await res.json();
      console.log('Profile submitted successfully:', data);
      
      // Redirect to analysis or confirmation page
      // You can add a redirect here based on the response
    } catch (error) {
      console.error('Error submitting profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Image src="/kulkan-logo.svg" alt="Kulkan Logo" width={80} height={30} />
            </div>
            <Link 
              href="/"
              className="text-sm text-gray-600 hover:text-gray-900 underline"
            >
              Review Your Responses
            </Link>
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-kulkan-green rounded-full flex items-center justify-center text-xs font-bold">
              k
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Review Your Startup Information</h1>
          </div>
          
          <p className="text-gray-600">
            Please review your responses below. You can edit any answer before proceeding to analysis.
          </p>
        </div>

        {/* Submit Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleSubmit}
            className="bg-kulkan-green hover:bg-yellow-300 text-gray-900 font-semibold py-3 px-8 rounded-lg shadow-sm transition-colors"
          >
            Submit for Analysis
          </button>
        </div>

        {/* Profile Data */}
        <div className="space-y-6">
          {Object.entries(profileData).map(([fieldId, data], index) => (
            <div key={fieldId} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(data.category)}`}>
                    {data.category}
                  </span>
                  <h3 className="font-semibold text-gray-900">
                    Q{index + 1}/ {data.question}
                  </h3>
                </div>
                <button
                  onClick={() => handleEdit(fieldId, data.answer)}
                  className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
              </div>

              {editingField === fieldId ? (
                <div className="space-y-3">
                  <textarea
                    value={tempAnswer}
                    onChange={(e) => setTempAnswer(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kulkan-green focus:border-transparent"
                    rows={4}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSave(fieldId)}
                      className="px-4 py-2 bg-kulkan-green hover:bg-yellow-300 text-gray-900 font-medium rounded-md transition-colors"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 rounded-md">
                    <p className="text-gray-900">{data.answer}</p>
                  </div>
                  {data.followUp && (
                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Follow-up response:</span> {data.followUp}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Navigation */}
        <div className="mt-12 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Questions
          </Link>
          
          <button className="text-gray-600 hover:text-gray-900">
            Start Over
          </button>
          
          <button
            onClick={handleSubmit}
            className="bg-kulkan-green hover:bg-yellow-300 text-gray-900 font-semibold py-2 px-6 rounded-lg shadow-sm transition-colors"
          >
            Submit for Analysis
          </button>
        </div>
      </div>
    </div>
  );
} 
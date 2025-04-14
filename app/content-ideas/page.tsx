"use client";

import { useState } from 'react';
import Link from 'next/link';
import axios from 'axios';

interface ContentIdea {
  id: number;
  title: string;
  description: string;
}

interface BusinessSpecifics {
  [key: string]: string;
}

interface BusinessDetails {
  Restaurant: BusinessSpecifics;
  Cafe: BusinessSpecifics;
  Salon: BusinessSpecifics;
  default: BusinessSpecifics;
  [key: string]: BusinessSpecifics;
}

// Mock data - business types and locations
const BUSINESS_TYPES = [
  "Restaurant",
  "Cafe",
  "Bakery",
  "Salon",
  "Spa",
  "Fitness Studio",
  "Clinic",
  "Retail Store",
  "Bookstore",
  "Art Gallery"
];

const LOCATIONS = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Miami, FL",
  "Seattle, WA",
  "Boston, MA",
  "San Francisco, CA",
  "Austin, TX",
  "Denver, CO"
];

// Mock idea templates by business type
const IDEA_TEMPLATES: { [key: string]: string[] } = {
  Restaurant: [
    "Top 5 {{ season }} dishes in {{ location }}",
    "Behind the scenes: How we source ingredients in {{ location }}",
    "Meet the chef: The story behind our {{ signature_dish }}",
    "{{ holiday }} special menu preview",
    "Local food trends in {{ location }} for {{ year }}"
  ],
  Cafe: [
    "Introducing our new {{ season }} blend from {{ location }}",
    "Coffee brewing tips from our baristas",
    "Pastry pairing guide for your morning coffee",
    "How to make our famous {{ signature_item }} at home",
    "{{ location }}'s coffee culture: What makes us unique"
  ],
  Salon: [
    "{{ season }} hair trends in {{ location }}",
    "Before & After: {{ treatment }} transformations",
    "Meet our stylists: {{ stylist_name }}'s journey",
    "Product spotlight: Why we use {{ product }} for {{ treatment }}",
    "{{ location }}'s most requested hairstyles this {{ season }}"
  ],
  default: [
    "Seasonal update: What's new at our {{ business_type }} in {{ location }}",
    "Customer spotlight: Meet our regulars",
    "Behind the scenes: A day in our {{ business_type }}",
    "{{ location }} community events we're participating in",
    "Special promotion: {{ offer_details }} this {{ season }}"
  ]
};

// Generate random ideas based on business type and location
function generateIdeas(businessType: string, location: string): ContentIdea[] {
  const templates = IDEA_TEMPLATES[businessType] || IDEA_TEMPLATES.default;
  
  const currentDate = new Date();
  const seasons = ["Spring", "Summer", "Fall", "Winter"];
  const currentSeason = seasons[Math.floor((currentDate.getMonth() / 12) * 4) % 4];
  const currentYear = currentDate.getFullYear();
  
  // Holiday logic based on current month
  const month = currentDate.getMonth();
  let nearestHoliday = "Holiday";
  if (month >= 0 && month < 2) nearestHoliday = "Valentine's Day";
  else if (month >= 2 && month < 5) nearestHoliday = "Easter";
  else if (month >= 5 && month < 8) nearestHoliday = "Summer Holiday";
  else if (month >= 8 && month < 10) nearestHoliday = "Halloween";
  else nearestHoliday = "Christmas";
  
  // Business-specific placeholders
  const businessDetails: BusinessDetails = {
    Restaurant: {
      signature_dish: ["Pasta Primavera", "Grilled Salmon", "Steak", "House Burger"][Math.floor(Math.random() * 4)]
    },
    Cafe: {
      signature_item: ["Latte Art", "Croissant", "Cold Brew", "Espresso Shot"][Math.floor(Math.random() * 4)]
    },
    Salon: {
      treatment: ["Color", "Balayage", "Keratin", "Cut and Style"][Math.floor(Math.random() * 4)],
      stylist_name: ["Alex", "Jamie", "Taylor", "Jordan"][Math.floor(Math.random() * 4)],
      product: ["Olaplex", "Redken", "Aveda", "Kerastase"][Math.floor(Math.random() * 4)]
    },
    default: {
      offer_details: ["10% off", "Buy one get one free", "Free consultation", "Member exclusive"][Math.floor(Math.random() * 4)]
    }
  };
  
  // Generate descriptions for each idea
  const descriptionTemplates = [
    "Great for increasing engagement and showcasing your expertise",
    "Perfect for highlighting your unique offerings in {{ location }}",
    "Customers love this type of content - great for shares and saves",
    "Builds community connection and shows your local roots",
    "Timely content that capitalizes on {{ season }} interest"
  ];
  
  // Fill in templates with appropriate values
  return templates.map((template: string, index: number): ContentIdea => {
    // Replace placeholders in template with values
    let title = template
      .replace('{{ location }}', location)
      .replace('{{ season }}', currentSeason)
      .replace('{{ year }}', currentYear.toString())
      .replace('{{ holiday }}', nearestHoliday)
      .replace('{{ business_type }}', businessType);
    
    // Replace business-specific placeholders
    const specificDetails = businessDetails[businessType] || businessDetails.default;
    for (const [key, value] of Object.entries(specificDetails)) {
      title = title.replace(new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g'), value);
    }
    
    // Create description with similar replacements
    let description = descriptionTemplates[index % descriptionTemplates.length]
      .replace('{{ location }}', location)
      .replace('{{ season }}', currentSeason);
    
    return {
      id: index + 1,
      title,
      description
    };
  });
}

export default function ContentIdeas() {
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<ContentIdea[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    
    console.log('Generating ideas for:', { businessType, location });
    
    try {
      // Call the API endpoint with the selected business type and location
      console.log('Making API request to /api/ideas');
      const response = await axios.post('/api/ideas', {
        businessType,
        location
      });
      
      console.log('API Response:', response.data);
      
      // Set the generated ideas from the API response
      setGeneratedIdeas(response.data.ideas);
    } catch (err) {
      console.error('Error generating ideas:', err);
      setError('Failed to generate ideas. Please try again.');
      // Fallback to local generation if API fails
      console.log('Falling back to local generation');
      const ideas = generateIdeas(businessType, location);
      setGeneratedIdeas(ideas);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleSaveIdea = (idea: ContentIdea) => {
    // Check if already saved
    if (!savedIdeas.some(saved => saved.id === idea.id)) {
      setSavedIdeas([...savedIdeas, idea]);
    }
  };
  
  const handleRemoveSavedIdea = (ideaId: number) => {
    setSavedIdeas(savedIdeas.filter(idea => idea.id !== ideaId));
  };
  
  const handleUseIdea = (idea: ContentIdea) => {
    // In a real app, this would redirect to post creation with prefilled data
    alert(`Creating new post with idea: ${idea.title}`);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-700 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Content Ideas Generator</h1>
          </div>
          <Link href="/posts" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Go to Posts →
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generator Form */}
          <div className="col-span-1 bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Generate Content Ideas</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-1">
                  Business Type
                </label>
                <select
                  id="businessType"
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {BUSINESS_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  {LOCATIONS.map(loc => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isGenerating 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isGenerating 
                  ? 'Generating Ideas...' 
                  : generatedIdeas.length > 0 
                    ? 'Generate New Ideas' 
                    : 'Generate Ideas'}
              </button>
              
              {error && (
                <div className="mt-2 p-2 bg-red-50 text-red-700 text-sm rounded-md">
                  {error}
                </div>
              )}
            </div>
            
            {/* Saved Ideas Section */}
            <div className="mt-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Ideas</h3>
              {savedIdeas.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p>No saved ideas yet.</p>
                  <p className="text-sm mt-1">Save ideas you like for later use.</p>
                </div>
              ) : (
                <ul className="space-y-3">
                  {savedIdeas.map(idea => (
                    <li key={idea.id} className="bg-blue-50 p-3 rounded-md relative">
                      <h4 className="font-medium text-blue-900 pr-8">{idea.title}</h4>
                      <button 
                        onClick={() => handleRemoveSavedIdea(idea.id)}
                        className="absolute top-2 right-2 text-blue-400 hover:text-blue-600"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <div className="flex mt-2">
                        <button 
                          onClick={() => handleUseIdea(idea)}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                        >
                          Use Idea
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          
          {/* Generated Ideas */}
          <div className="col-span-1 lg:col-span-2">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              {generatedIdeas.length > 0 
                ? `Ideas for ${businessType} in ${location}` 
                : 'Your Ideas Will Appear Here'}
            </h2>
            
            {generatedIdeas.length === 0 && !isGenerating ? (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No ideas generated yet</h3>
                <p className="text-gray-500 mb-4">Select your business type and location, then click "Generate Ideas"</p>
              </div>
            ) : (
              isGenerating ? (
                <div className="bg-white rounded-lg shadow p-8 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Generating ideas based on your business...</p>
                </div>
              ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul className="divide-y divide-gray-200">
                    {generatedIdeas.map((idea) => (
                      <li key={idea.id} className="px-4 py-5 sm:px-6 hover:bg-gray-50">
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{idea.title}</h3>
                          <p className="mt-1 text-sm text-gray-500">{idea.description}</p>
                          
                          <div className="mt-3 flex space-x-2">
                            <button 
                              onClick={() => handleUseIdea(idea)}
                              className="px-3 py-1 bg-green-100 text-green-800 rounded-md text-sm hover:bg-green-200"
                            >
                              Use This Idea
                            </button>
                            <button 
                              onClick={() => handleSaveIdea(idea)}
                              className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
                              disabled={savedIdeas.some(saved => saved.id === idea.id)}
                            >
                              {savedIdeas.some(saved => saved.id === idea.id) ? 'Saved' : 'Save for Later'}
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 
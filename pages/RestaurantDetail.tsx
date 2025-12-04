import React, { useState, useEffect } from 'react';
import { Restaurant, Review } from '../types';
import { ArrowLeft, Star, MapPin, Sparkles, User, Ghost, Clock, Loader2 } from 'lucide-react';
import { ReviewForm } from '../components/ReviewForm';
import { summarizeReviews } from '../services/geminiService';

interface RestaurantDetailProps {
  restaurant: Restaurant;
  onBack: () => void;
  onAddReview: (rating: number, comment: string, isAnonymous: boolean, sentiment: 'positive' | 'neutral' | 'negative') => void;
}

export const RestaurantDetail: React.FC<RestaurantDetailProps> = ({ restaurant, onBack, onAddReview }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const handleSummarize = async () => {
    setIsSummarizing(true);
    const result = await summarizeReviews(restaurant.reviews);
    setSummary(result);
    setIsSummarizing(false);
  };

  const handleReviewSubmit = async (rating: number, comment: string, isAnonymous: boolean, sentiment: 'positive' | 'neutral' | 'negative') => {
    setIsSubmittingReview(true);
    // Simulate network delay for effect
    await new Promise(resolve => setTimeout(resolve, 800));
    onAddReview(rating, comment, isAnonymous, sentiment);
    setIsSubmittingReview(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to list
      </button>

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
        <div className="h-64 sm:h-80 relative">
          <img 
            src={restaurant.imageUrl} 
            alt={restaurant.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{restaurant.name}</h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <span className="flex items-center px-3 py-1 bg-yellow-500/20 backdrop-blur-md border border-yellow-500/30 rounded-full text-yellow-300 font-bold">
                <Star className="h-4 w-4 mr-1 fill-current" />
                {restaurant.averageRating.toFixed(1)} ({restaurant.reviews.length} reviews)
              </span>
              <span className="flex items-center">
                <MapPin className="h-4 w-4 mr-1" />
                {restaurant.location}
              </span>
            </div>
          </div>
        </div>
        
        <div className="p-6 sm:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {restaurant.cuisine.map(tag => (
              <span key={tag} className="px-3 py-1 bg-rose-50 text-rose-700 font-medium rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">{restaurant.description}</p>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form & Summary */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-rose-50 rounded-xl p-6 border border-rose-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-rose-900 flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-rose-600" />
                AI Summary
              </h3>
              {!summary && restaurant.reviews.length > 0 && (
                <button 
                  onClick={handleSummarize}
                  disabled={isSummarizing}
                  className="text-xs bg-white text-rose-700 px-2 py-1 rounded border border-rose-200 hover:bg-rose-50 shadow-sm"
                >
                  {isSummarizing ? "Thinking..." : "Generate"}
                </button>
              )}
            </div>
            
            {isSummarizing ? (
              <div className="flex items-center justify-center py-4 text-rose-700">
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
                <span className="text-sm">Reading reviews...</span>
              </div>
            ) : summary ? (
              <div className="text-sm text-rose-800 leading-relaxed whitespace-pre-line">
                {summary}
              </div>
            ) : (
               <p className="text-sm text-rose-700/70 italic">
                 {restaurant.reviews.length > 0 ? "Click generate to see what the AI thinks about this place." : "No reviews to summarize yet."}
               </p>
            )}
          </div>
          
          <div className="sticky top-24">
             <ReviewForm onSubmit={handleReviewSubmit} isSubmitting={isSubmittingReview} />
          </div>
        </div>

        {/* Right Column: Review List */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Student Reviews</h3>
          
          {restaurant.reviews.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500">No reviews yet. Be the first to try {restaurant.name}!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...restaurant.reviews].reverse().map((review) => (
                <div key={review.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-full mr-3 ${review.isAnonymous ? 'bg-gray-100' : 'bg-rose-100'}`}>
                        {review.isAnonymous ? <Ghost className="h-5 w-5 text-gray-600" /> : <User className="h-5 w-5 text-rose-600" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">
                          {review.isAnonymous ? "Anonymous Student" : review.userId}
                        </p>
                        <div className="flex items-center text-xs text-gray-400 mt-0.5">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(review.timestamp).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-md border border-yellow-100">
                       <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 mr-1" />
                       <span className="font-bold text-yellow-700 text-sm">{review.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>
                  {review.sentiment && (
                     <div className="mt-3 flex justify-end">
                       <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                         review.sentiment === 'positive' ? 'bg-green-100 text-green-700' :
                         review.sentiment === 'negative' ? 'bg-red-100 text-red-700' :
                         'bg-gray-100 text-gray-600'
                       }`}>
                         {review.sentiment} vibe
                       </span>
                     </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { Star, Send, Loader2, Ghost } from 'lucide-react';
import { analyzeSentiment } from '../services/geminiService';

interface ReviewFormProps {
  onSubmit: (rating: number, comment: string, isAnonymous: boolean, sentiment: 'positive' | 'neutral' | 'negative') => void;
  isSubmitting: boolean;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit, isSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true); // Default to anonymous as per requirements

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    
    // Optimistic prediction or separate async step could be done here.
    // We will do it in the parent or here. Let's do it here to pass enriched data.
    // Note: In a real app, sentiment analysis might happen on the backend, 
    // but here we do it client-side via our service wrapper.
    const sentiment = await analyzeSentiment(comment);
    
    onSubmit(rating, comment, isAnonymous, sentiment);
    setComment('');
    setRating(0);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Write a Review</h3>
      
      {/* Star Rating */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star
                className={`h-8 w-8 ${
                  star <= (hoverRating || rating)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Your Experience</label>
        <textarea
          required
          rows={3}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none transition-all"
          placeholder="How was the food? Was it spicy? Value for money?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {/* Anonymous Toggle & Submit */}
      <div className="flex items-center justify-between">
        <label className="flex items-center cursor-pointer group">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
            />
            <div className={`block w-10 h-6 rounded-full transition-colors ${isAnonymous ? 'bg-rose-600' : 'bg-gray-300'}`}></div>
            <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isAnonymous ? 'transform translate-x-4' : ''}`}></div>
          </div>
          <div className="ml-3 text-sm text-gray-600 flex items-center gap-2 group-hover:text-gray-900">
            <Ghost className={`h-4 w-4 ${isAnonymous ? 'text-rose-600' : 'text-gray-400'}`} />
            {isAnonymous ? 'Posting Anonymously' : 'Show my ID'}
          </div>
        </label>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className="inline-flex items-center px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-lg shadow-gray-900/20"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Posting...
            </>
          ) : (
            <>
              Post Review
              <Send className="ml-2 h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
};
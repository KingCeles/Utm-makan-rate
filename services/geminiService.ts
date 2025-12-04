import { Review, Restaurant } from "../types";

// Mock Interface for Chat
export interface MockChatSession {
  sendMessageStream: (params: { message: string }) => AsyncGenerator<{ text: string }>;
}

/**
 * Generates a short, appetizing description for a restaurant based on its name and cuisine type.
 * (Mock Implementation)
 */
export const generateRestaurantDescription = async (name: string, cuisine: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));
  return `A popular campus spot named "${name}" serving delicious ${cuisine}. Great for students looking for a quick and tasty meal!`;
};

/**
 * Summarizes a list of reviews into a helpful insight.
 * (Mock Implementation)
 */
export const summarizeReviews = async (reviews: Review[]): Promise<string> => {
  if (reviews.length === 0) return "No reviews yet.";
  
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));

  const positiveCount = reviews.filter(r => r.rating >= 4).length;
  if (positiveCount > reviews.length / 2) {
    return "• Most students love the food here!\n• Great value for money according to recent reviews.\n• Service is generally fast and friendly.";
  } else {
    return "• Opinions are mixed regarding the food quality.\n• Some students find it affordable, while others expected more.\n• Can get quite crowded during peak hours.";
  }
};

/**
 * Analyzes the sentiment of a review before posting.
 * (Mock Implementation using simple keywords)
 */
export const analyzeSentiment = async (comment: string): Promise<'positive' | 'neutral' | 'negative'> => {
  // Simulate delay
  await new Promise(resolve => setTimeout(resolve, 500));

  const lower = comment.toLowerCase();
  const positiveWords = ['good', 'great', 'delicious', 'yummy', 'best', 'love', 'nice', 'awesome'];
  const negativeWords = ['bad', 'terrible', 'worst', 'slow', 'dirty', 'expensive', 'hate', 'cold'];

  let score = 0;
  positiveWords.forEach(w => { if (lower.includes(w)) score++; });
  negativeWords.forEach(w => { if (lower.includes(w)) score--; });

  if (score > 0) return 'positive';
  if (score < 0) return 'negative';
  return 'neutral';
};

/**
 * Creates a chat session context-aware of the current restaurants.
 * (Mock Implementation)
 */
export const createFoodGuideChat = (restaurants: Restaurant[]): MockChatSession => {
  // We ignore the restaurant data in the mock, but in a real version we would use it.
  
  return {
    sendMessageStream: async function* ({ message }) {
      // Simple mock responses based on keywords
      const lowerMsg = message.toLowerCase();
      let responseText = "I'm just a simple bot right now, but I recommend checking out Arca Meranti for local food!";

      if (lowerMsg.includes('spicy')) {
        responseText = "If you like spicy food, you definitely need to try the Tom Yam at Bamboo Cafe. It packs a punch! 🌶️";
      } else if (lowerMsg.includes('coffee') || lowerMsg.includes('cafe')) {
        responseText = "For coffee, Scholar's Inn is the place to be. Great vibes for studying too! ☕";
      } else if (lowerMsg.includes('cheap') || lowerMsg.includes('budget')) {
        responseText = "Arca Meranti has some very affordable mixed rice options. Great for saving money!";
      } else if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        responseText = "Hello! I'm your UTM Food Guide. Ask me about where to eat on campus!";
      }

      // Simulate streaming the response word by word
      const words = responseText.split(' ');
      for (const word of words) {
        await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 50));
        yield { text: word + " " };
      }
    }
  };
};
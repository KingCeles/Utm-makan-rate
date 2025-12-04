import React, { useState } from 'react';
import { Restaurant, User } from '../types';
import { RestaurantCard } from '../components/RestaurantCard';
import { Search, Plus, Sparkles, Loader2, ArrowDownUp } from 'lucide-react';
import { generateRestaurantDescription } from '../services/geminiService';

interface HomeProps {
  restaurants: Restaurant[];
  currentUser: User;
  onRestaurantClick: (id: string) => void;
  onAddRestaurant: (restaurant: Restaurant) => void;
}

type SortOption = 'RATING_DESC' | 'NEWEST' | 'NAME_ASC';

export const Home: React.FC<HomeProps> = ({ restaurants, currentUser, onRestaurantClick, onAddRestaurant }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('RATING_DESC');
  
  // Add Restaurant Form State
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('UTM Skudai');
  const [newCuisine, setNewCuisine] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isGeneratingDesc, setIsGeneratingDesc] = useState(false);

  const filteredRestaurants = restaurants
    .filter(r => 
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      r.cuisine.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortBy === 'RATING_DESC') return b.averageRating - a.averageRating;
      if (sortBy === 'NAME_ASC') return a.name.localeCompare(b.name);
      // Newest (using ID as proxy since ID is timestamp for new ones)
      return parseInt(b.id) - parseInt(a.id); 
    });

  const handleGenerateDescription = async () => {
    if (!newName || !newCuisine) return;
    setIsGeneratingDesc(true);
    const desc = await generateRestaurantDescription(newName, newCuisine);
    setNewDescription(desc);
    setIsGeneratingDesc(false);
  };

  const handleSubmitNewRestaurant = (e: React.FormEvent) => {
    e.preventDefault();
    const newRestaurant: Restaurant = {
      id: Date.now().toString(),
      name: newName,
      location: newLocation,
      cuisine: newCuisine.split(',').map(c => c.trim()),
      description: newDescription || `A great place to eat ${newCuisine}.`,
      imageUrl: `https://picsum.photos/400/300?random=${Date.now()}`, // Placeholder
      reviews: [],
      averageRating: 0,
    };
    onAddRestaurant(newRestaurant);
    setIsModalOpen(false);
    // Reset form
    setNewName('');
    setNewCuisine('');
    setNewDescription('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Find Food</h2>
          <p className="text-gray-500 mt-1">Discover the best food spots around campus.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search food or place..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              <ArrowDownUp className="h-4 w-4" />
            </div>
            <select 
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none appearance-none bg-white cursor-pointer h-full text-sm font-medium text-gray-700"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
            >
              <option value="RATING_DESC">Top Rated</option>
              <option value="NEWEST">Newest</option>
              <option value="NAME_ASC">A-Z</option>
            </select>
          </div>

          {/* Only Admin can add spots */}
          {currentUser.role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-rose-900 text-white rounded-lg hover:bg-rose-800 transition-colors shadow-lg shadow-rose-900/20 whitespace-nowrap"
            >
              <Plus className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">Add Spot</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      {filteredRestaurants.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map(restaurant => (
            <RestaurantCard 
              key={restaurant.id} 
              restaurant={restaurant} 
              onClick={onRestaurantClick} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No restaurants found matching "{searchTerm}".</p>
          {currentUser.role === 'admin' && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="mt-4 text-rose-600 hover:underline font-medium"
            >
              Add it yourself?
            </button>
          )}
        </div>
      )}

      {/* Add Restaurant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Restaurant</h3>
            <form onSubmit={handleSubmitNewRestaurant}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder="e.g., Arca Meranti Cafe"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cuisine Type</label>
                  <input
                    required
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    placeholder="e.g., Malay, Western, Spicy"
                    value={newCuisine}
                    onChange={(e) => setNewCuisine(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                    <button 
                      type="button" 
                      onClick={handleGenerateDescription}
                      disabled={!newName || !newCuisine || isGeneratingDesc}
                      className="ml-2 text-xs text-rose-600 hover:text-rose-800 disabled:text-gray-400 font-medium inline-flex items-center"
                    >
                      {isGeneratingDesc ? <Loader2 className="animate-spin h-3 w-3 mr-1"/> : <Sparkles className="h-3 w-3 mr-1"/>}
                      {isGeneratingDesc ? "Generating..." : "Auto-fill with AI"}
                    </button>
                  </label>
                  <textarea
                    required
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500 resize-none"
                    placeholder="Brief description..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-rose-500 focus:border-rose-500"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-900 text-white font-medium rounded-lg hover:bg-rose-800 transition-colors shadow-md"
                >
                  Add Place
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

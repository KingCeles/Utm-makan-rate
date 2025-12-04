import React from 'react';
import { Star, MapPin } from 'lucide-react';
import { Restaurant } from '../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onClick: (id: string) => void;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onClick }) => {
  return (
    <div 
      onClick={() => onClick(restaurant.id)}
      className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col h-full transform hover:-translate-y-1"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.imageUrl} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md flex items-center shadow-sm">
          <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
          <span className="text-sm font-bold text-gray-800">{restaurant.averageRating.toFixed(1)}</span>
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{restaurant.name}</h3>
        </div>
        
        <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{restaurant.description}</p>
        
        <div className="flex items-center text-xs text-gray-500 mb-3">
          <MapPin className="h-3 w-3 mr-1" />
          {restaurant.location}
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {restaurant.cuisine.map((tag) => (
            <span key={tag} className="px-2 py-1 bg-rose-50 text-rose-700 text-xs font-medium rounded-md">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
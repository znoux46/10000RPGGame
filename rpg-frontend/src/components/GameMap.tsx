'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Character, Location, moveCharacter, getLocations, getCharacter } from '@/lib/api';

interface GameMapProps {
  character: Character;
  onCharacterUpdate: (character: Character) => void;
}

export default function GameMap({ character, onCharacterUpdate }: GameMapProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (character && locations.length > 0) {
      const loc = locations.find(l => l.id === character.currentLocationId);
      if (loc) setCurrentLocation(loc);
    }
  }, [character, locations]);

  const loadLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load locations');
    }
  };

  const handleMove = async (locationId: number) => {
    if (locationId === character.currentLocationId) return;
    
    setIsLoading(true);
    setError('');

    try {
      const result = await moveCharacter(character.id, locationId);
      
      // Update character with new data from API
      const updatedCharacter: Character = {
        id: result.id,
        name: result.name,
        level: result.level,
        experience: result.experience,
        gold: result.gold,
        currentLocationId: result.currentLocationId,
        currentLocation: result.currentLocation,
      };
      
      setCurrentLocation(result.currentLocation);
      onCharacterUpdate(updatedCharacter);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to move character');
    } finally {
      setIsLoading(false);
    }
  };

  const expNeeded = character.level * 100;
  const expProgress = (character.experience / expNeeded) * 100;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        {currentLocation?.backgroundImageUrl ? (
          <Image
            src={currentLocation.backgroundImageUrl}
            alt={currentLocation.name}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-gray-900 to-gray-800" />
        )}
      </div>

      {/* Character Stats - Top Right */}
      <div className="fixed top-4 right-4 z-10 bg-gray-900/90 border-2 border-yellow-600 p-4 rounded-lg shadow-xl">
        <h2 className="text-xl font-bold text-yellow-400 mb-2">{character.name}</h2>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Cấp:</span>
            <span className="text-yellow-400 font-bold">{character.level}</span>
          </div>
          
          <div>
            <div className="flex justify-between text-gray-400 mb-1">
              <span>Kinh Nghiệm:</span>
              <span className="text-green-400">{character.experience}/{expNeeded}</span>
            </div>
            <div className="w-32 h-2 bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{ width: `${expProgress}%` }}
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Vàng:</span>
            <span className="text-yellow-500 font-bold">{character.gold} 💰</span>
          </div>
          
          <div className="flex justify-between">
            <span className="text-gray-400">Địa điểm:</span>
            <span className="text-blue-400">{currentLocation?.name || 'Unknown'}</span>
          </div>
        </div>
      </div>

      {/* Location Buttons - Bottom Center */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10 flex gap-4 flex-wrap justify-center max-w-4xl px-4">
        {locations.map((location) => {
          const isCurrentLocation = location.id === character.currentLocationId;
          return (
            <button
              key={location.id}
              onClick={() => handleMove(location.id)}
              disabled={isLoading || isCurrentLocation}
              className={`
                px-6 py-3 rounded-lg font-bold transition-all duration-300 transform hover:scale-105
                ${isCurrentLocation 
                  ? 'bg-green-600 text-white cursor-default' 
                  : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-lg hover:shadow-yellow-500/50'
                }
                ${isLoading ? 'opacity-50 cursor-wait' : ''}
              `}
            >
              {isCurrentLocation ? `✅ ${location.name}` : location.name}
            </button>
          );
        })}
      </div>

      {/* Error Message */}
      {error && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-20 bg-red-900/90 border border-red-500 text-red-200 px-6 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-30 bg-black/50 flex items-center justify-center">
          <div className="text-white text-xl animate-pulse">Đang di chuyển...</div>
        </div>
      )}
    </div>
  );
}

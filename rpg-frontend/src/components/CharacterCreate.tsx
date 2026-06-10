'use client';

import { useState } from 'react';
import { createCharacter, Character } from '@/lib/api';

interface CharacterCreateProps {
  onCharacterCreated: (character: Character) => void;
}

export default function CharacterCreate({ onCharacterCreated }: CharacterCreateProps) {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const character = await createCharacter(name);
      onCharacterCreated(character);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-yellow-400 mb-6 text-center">
          🎮 Tạo Nhân Vật
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
              Tên Nhân Vật
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên nhân vật..."
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white placeholder-gray-400"
              required
              minLength={2}
              maxLength={20}
            />
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-yellow-600 hover:bg-yellow-500 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors duration-200"
          >
            {isLoading ? 'Đang tạo...' : 'Tạo Nhân Vật'}
          </button>
        </form>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import CharacterCreate from '@/components/CharacterCreate';
import GameMap from '@/components/GameMap';
import { Character } from '@/lib/api';

export default function Home() {
  const [character, setCharacter] = useState<Character | null>(null);

  const handleCharacterCreated = (newCharacter: Character) => {
    setCharacter(newCharacter);
  };

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    setCharacter(updatedCharacter);
  };

  if (!character) {
    return <CharacterCreate onCharacterCreated={handleCharacterCreated} />;
  }

  return <GameMap character={character} onCharacterUpdate={handleCharacterUpdate} />;
}

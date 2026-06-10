const API_BASE_URL = 'http://localhost:5000/api/game';

export interface Character {
  id: number;
  name: string;
  level: number;
  experience: number;
  gold: number;
  currentLocationId: number;
  currentLocation?: Location;
}

export interface Location {
  id: number;
  name: string;
  description: string;
  x: number;
  y: number;
  backgroundImageUrl: string;
}

export interface MoveRequest {
  characterId: number;
  targetLocationId: number;
}

export interface MoveResponse {
  id: number;
  name: string;
  level: number;
  experience: number;
  gold: number;
  currentLocationId: number;
  currentLocation: Location;
  previousLocationId: number;
  expGained: number;
  message: string;
}

// API Functions
export async function createCharacter(name: string): Promise<Character> {
  const response = await fetch(`${API_BASE_URL}/character/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create character');
  }

  return response.json();
}

export async function getCharacter(id: number): Promise<Character> {
  const response = await fetch(`${API_BASE_URL}/character/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get character');
  }

  return response.json();
}

export async function moveCharacter(characterId: number, targetLocationId: number): Promise<MoveResponse> {
  const response = await fetch(`${API_BASE_URL}/character/move`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ characterId, targetLocationId }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to move character');
  }

  return response.json();
}

export async function getLocations(): Promise<Location[]> {
  const response = await fetch(`${API_BASE_URL}/locations`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get locations');
  }

  return response.json();
}

export async function getLocation(id: number): Promise<Location> {
  const response = await fetch(`${API_BASE_URL}/locations/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to get location');
  }

  return response.json();
}

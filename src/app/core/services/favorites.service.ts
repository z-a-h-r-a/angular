import { Injectable } from '@angular/core';
import { Suggestion } from '../../models/suggestion';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly STORAGE_KEY = 'favorites';

  constructor() {}

  // Get all favorites from localStorage
  getFavorites(): Suggestion[] {
    const favoritesJson = localStorage.getItem(this.STORAGE_KEY);
    if (favoritesJson) {
      return JSON.parse(favoritesJson);
    }
    return [];
  }

  // Add a suggestion to favorites
  addToFavorites(suggestion: Suggestion): void {
    const favorites = this.getFavorites();
    if (!favorites.find(fav => fav.id === suggestion.id)) {
      favorites.push(suggestion);
      this.saveFavorites(favorites);
    }
  }

  // Remove a suggestion from favorites
  removeFromFavorites(suggestion: Suggestion): void {
    const favorites = this.getFavorites();
    const index = favorites.findIndex(fav => fav.id === suggestion.id);
    if (index > -1) {
      favorites.splice(index, 1);
      this.saveFavorites(favorites);
    }
  }

  // Check if a suggestion is in favorites
  isFavorite(suggestion: Suggestion): boolean {
    const favorites = this.getFavorites();
    return favorites.some(fav => fav.id === suggestion.id);
  }

  // Save favorites to localStorage
  private saveFavorites(favorites: Suggestion[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
  }
}

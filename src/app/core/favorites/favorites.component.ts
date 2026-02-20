import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FavoritesService } from '../services/favorites.service';
import { Suggestion } from '../../models/suggestion';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  favorites: Suggestion[] = [];

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit(): void {
    this.favorites = this.favoritesService.getFavorites();
  }

  // Method to remove from favorites
  removeFromFavorites(suggestion: Suggestion): void {
    this.favoritesService.removeFromFavorites(suggestion);
    this.favorites = this.favoritesService.getFavorites();
  }

  // Method to get status class
  getStatusClass(status: string): string {
    switch(status) {
      case 'acceptee': return 'status-accepted';
      case 'refusee': return 'status-refused';
      case 'en_attente': return 'status-pending';
      default: return '';
    }
  }

  // Method to get status text
  getStatusText(status: string): string {
    switch(status) {
      case 'acceptee': return 'Acceptée';
      case 'refusee': return 'Refusée';
      case 'en_attente': return 'En attente';
      default: return status;
    }
  }
}

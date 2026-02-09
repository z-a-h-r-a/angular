import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-list',
  templateUrl: './suggestion-list.component.html',
  styleUrl: './suggestion-list.component.css'
})
export class SuggestionListComponent {
  suggestions: Suggestion[] = [
    { id: 1, title: 'Suggestion 1', description: 'Description 1', category: 'Category 1', date: new Date(), status: 'en_attente', nbLikes: 10 },
    { id: 2, title: 'Suggestion 2', description: 'Description 2', category: 'Category 2', date: new Date(), status: 'acceptee', nbLikes: 20 },
    // Add more mock data as needed
  ];

  constructor(private router: Router) {}

  viewDetails(id: number): void {
    this.router.navigate(['/suggestions', id]);
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Suggestion } from '../../../models/suggestion';

@Component({
  selector: 'app-suggestion-details',
  templateUrl: './suggestion-details.component.html',
  styleUrl: './suggestion-details.component.css'
})
export class SuggestionDetailsComponent implements OnInit {
  suggestion: Suggestion | undefined;

  // Mock data for demonstration
  suggestions: Suggestion[] = [
    { id: 1, title: 'Suggestion 1', description: 'Description 1', category: 'Category 1', date: new Date(), status: 'en_attente', nbLikes: 10 },
    { id: 2, title: 'Suggestion 2', description: 'Description 2', category: 'Category 2', date: new Date(), status: 'acceptee', nbLikes: 20 },
    // Add more mock data as needed
  ];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.suggestion = this.suggestions.find(s => s.id === id);
  }

  goBack(): void {
    this.router.navigate(['/suggestions']);
  }
}

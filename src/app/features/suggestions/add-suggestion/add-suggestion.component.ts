import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-add-suggestion',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-suggestion.component.html',
  styleUrl: './add-suggestion.component.css'
})
export class AddSuggestionComponent implements OnInit {
  suggestion: Suggestion = {
    id: 0,
    title: '',
    description: '',
    category: '',
    date: new Date(),
    status: 'en_attente',
    nbLikes: 0
  };
  
  isEditMode = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      const existingSuggestion = this.suggestionService.getSuggestionByIdLocal(+id);
      if (existingSuggestion) {
        this.suggestion = { ...existingSuggestion };
      }
    }
  }

  onSubmit(): void {
    if (this.isEditMode) {
      this.suggestionService.updateSuggestionLocal(this.suggestion.id, this.suggestion);
    } else {
      this.suggestionService.addSuggestionLocal(this.suggestion);
    }
    this.router.navigate(['/suggestions']);
  }

  goBack(): void {
    this.router.navigate(['/suggestions']);
  }
}

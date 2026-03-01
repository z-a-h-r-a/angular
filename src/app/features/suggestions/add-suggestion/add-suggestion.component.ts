import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Suggestion } from '../../../models/suggestion';
import { SuggestionService } from '../../../core/services/suggestion.service';

@Component({
  selector: 'app-add-suggestion',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-suggestion.component.html',
  styleUrl: './add-suggestion.component.css'
})
export class AddSuggestionComponent implements OnInit {
  suggestionForm!: FormGroup;
  isEditMode = false;
  
  categories: string[] = [
    'Infrastructure et batiments',
    'Technologie et services numériques',
    'Restauration et cafétéria',
    'Hygiene et environnement',
    'Transport et mobilité',
    'Activités et événements',
    'Sécurité',
    'Communication interne',
    'Accessibilité',
    'Autre'
  ];

  constructor(
    private fb: FormBuilder,
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
        this.initForm(existingSuggestion);
      } else {
        this.initForm();
      }
    } else {
      this.initForm();
    }
  }

  private initForm(suggestion?: Suggestion): void {
    const suggestionDate = suggestion?.date 
      ? new Date(suggestion.date).toISOString().split('T')[0] 
      : new Date().toISOString().split('T')[0];
    
    this.suggestionForm = this.fb.group({
      title: [
        suggestion?.title || '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.pattern(/^[A-Z][a-zA-Z]*$/)
        ]
      ],
      description: [
        suggestion?.description || '',
        [
          Validators.required,
          Validators.minLength(30)
        ]
      ],
      category: [
        suggestion?.category || '',
        Validators.required
      ],
      date: [
        suggestionDate,
        Validators.required
      ],
      status: [
        suggestion?.status || 'en_attente',
        Validators.required
      ]
    });
  }

  onSubmit(): void {
    if (this.suggestionForm.invalid) {
      return;
    }

    const formValue = this.suggestionForm.value;
    const currentSuggestions = this.suggestionService.getSuggestionsListLocal();
    
    let suggestion: Suggestion;
    
    if (this.isEditMode) {
      const id = +this.route.snapshot.paramMap.get('id')!;
      const existingSuggestion = this.suggestionService.getSuggestionByIdLocal(id);
      suggestion = {
        id: id,
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        date: new Date(formValue.date),
        status: formValue.status,
        nbLikes: existingSuggestion?.nbLikes || 0
      };
      this.suggestionService.updateSuggestionLocal(suggestion.id, suggestion);
    } else {
      suggestion = {
        id: Math.max(...currentSuggestions.map(s => s.id), 0) + 1,
        title: formValue.title,
        description: formValue.description,
        category: formValue.category,
        date: new Date(formValue.date),
        status: formValue.status,
        nbLikes: 0
      };
      this.suggestionService.addSuggestionLocal(suggestion);
    }
    
    this.router.navigate(['/suggestions']);
  }

  goBack(): void {
    this.router.navigate(['/suggestions']);
  }

  // Getter for easy access to form fields
  get f() {
    return this.suggestionForm.controls;
  }
}

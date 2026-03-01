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
  currentId: number = 0;
  
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
      this.currentId = +id;
      this.loadExistingSuggestion(this.currentId);
    } else {
      this.initForm();
    }
  }

  /**
   * Load existing suggestion for editing using HTTP GET
   */
  private loadExistingSuggestion(id: number): void {
    this.suggestionService.getSuggestionById(id).subscribe({
      next: (data) => {
        this.initForm(data);
      },
      error: (err) => {
        console.error('Error loading suggestion:', err);
        // Fallback to local data
        const localSuggestion = this.suggestionService.getSuggestionByIdLocal(id);
        if (localSuggestion) {
          this.initForm(localSuggestion);
        } else {
          this.initForm();
        }
      }
    });
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
    
    const suggestion: Suggestion = {
      id: this.isEditMode ? this.currentId : 0,
      title: formValue.title,
      description: formValue.description,
      category: formValue.category,
      date: new Date(formValue.date),
      status: formValue.status,
      nbLikes: 0
    };

    if (this.isEditMode) {
      this.updateSuggestion(suggestion);
    } else {
      this.addNewSuggestion(suggestion);
    }
  }

  /**
   * Add a new suggestion using HTTP POST
   */
  private addNewSuggestion(suggestion: Suggestion): void {
    this.suggestionService.addSuggestion(suggestion).subscribe({
      next: (newSuggestion) => {
        console.log('Suggestion ajoutée avec succès:', newSuggestion);
        this.router.navigate(['/suggestions']);
      },
      error: (err) => {
        console.error('Erreur lors de l\'ajout:', err);
        // Fallback to local add
        this.suggestionService.addSuggestionLocal(suggestion);
        this.router.navigate(['/suggestions']);
      }
    });
  }

  /**
   * Update an existing suggestion using HTTP PUT
   */
  private updateSuggestion(suggestion: Suggestion): void {
    // Get existing nbLikes
    const existingSuggestion = this.suggestionService.getSuggestionByIdLocal(this.currentId);
    suggestion.nbLikes = existingSuggestion?.nbLikes || 0;

    this.suggestionService.updateSuggestion(this.currentId, suggestion).subscribe({
      next: () => {
        console.log('Suggestion mise à jour avec succès');
        this.router.navigate(['/suggestions']);
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour:', err);
        // Fallback to local update
        this.suggestionService.updateSuggestionLocal(this.currentId, suggestion);
        this.router.navigate(['/suggestions']);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/suggestions']);
  }

  // Getter for easy access to form fields
  get f() {
    return this.suggestionForm.controls;
  }
}

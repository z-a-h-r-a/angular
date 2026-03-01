import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { Suggestion } from "../../../models/suggestion";
import { SuggestionService } from "../../../core/services/suggestion.service";

@Component({
  selector: "app-suggestion-list",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./suggestion-list.component.html",
  styleUrl: "./suggestion-list.component.css"
})
export class SuggestionListComponent implements OnInit, OnDestroy {
  suggestions: Suggestion[] = [];
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    // Subscribe to the BehaviorSubject to get real-time updates
    this.subscriptions.add(
      this.suggestionService.suggestions$.subscribe(suggestions => {
        this.suggestions = suggestions;
      })
    );

    // Load suggestions from the server
    this.loadSuggestions();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscriptions.unsubscribe();
  }

  /**
   * Load all suggestions from the server using HTTP GET
   */
  loadSuggestions(): void {
    this.suggestionService.getSuggestionsList().subscribe({
      next: (data) => {
        this.suggestions = data;
      },
      error: (err) => {
        console.error('Error loading suggestions:', err);
      }
    });
  }

  viewDetails(id: number): void {
    this.router.navigate(["/suggestions", id]);
  }

  addSuggestion(): void {
    this.router.navigate(["/suggestions/add"]);
  }

  /**
   * Delete a suggestion using HTTP DELETE
   */
  deleteSuggestion(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette suggestion?')) {
      this.suggestionService.deleteSuggestion(id).subscribe({
        next: () => {
          console.log('Suggestion supprimée avec succès');
          this.router.navigate(["/suggestions"]);
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          // Fallback to local delete if HTTP fails
          this.suggestionService.deleteSuggestionLocal(id);
          this.router.navigate(["/suggestions"]);
        }
      });
    }
  }

  /**
   * Increment likes using HTTP PATCH
   */
  incrementLikes(id: number): void {
    const suggestion = this.suggestions.find(s => s.id === id);
    if (suggestion) {
      const newLikes = suggestion.nbLikes + 1;
      this.suggestionService.updateLikes(id, newLikes).subscribe({
        next: () => {
          console.log('Likes mis à jour');
        },
        error: (err) => {
          console.error('Erreur lors de la mise à jour des likes:', err);
          // Fallback to local update if HTTP fails
          this.suggestionService.updateLikesLocal(id);
        }
      });
    }
  }

  /**
   * Get status label in French
   */
  getStatusLabel(status: string): string {
    const statusLabels: { [key: string]: string } = {
      'en_attente': 'En attente',
      'acceptee': 'Acceptée',
      'refusee': 'Refusée'
    };
    return statusLabels[status] || status;
  }
}

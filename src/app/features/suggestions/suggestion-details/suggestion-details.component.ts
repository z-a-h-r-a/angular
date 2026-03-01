import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { Suggestion } from "../../../models/suggestion";
import { SuggestionService } from "../../../core/services/suggestion.service";

@Component({
  selector: "app-suggestion-details",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./suggestion-details.component.html",
  styleUrl: "./suggestion-details.component.css"
})
export class SuggestionDetailsComponent implements OnInit {
  suggestion: Suggestion | undefined;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get("id")!;
    this.loadSuggestion(id);
  }

  /**
   * Load suggestion details from the server using HTTP GET
   */
  loadSuggestion(id: number): void {
    this.loading = true;
    this.suggestionService.getSuggestionById(id).subscribe({
      next: (data) => {
        this.suggestion = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading suggestion:', err);
        this.error = 'Erreur lors du chargement de la suggestion';
        // Fallback to local data
        this.suggestion = this.suggestionService.getSuggestionByIdLocal(id);
        this.loading = false;
      }
    });
  }

  goBack(): void {
    this.router.navigate(["/suggestions"]);
  }

  updateSuggestion(): void {
    if (this.suggestion) {
      this.router.navigate(["/suggestions/add", this.suggestion.id]);
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

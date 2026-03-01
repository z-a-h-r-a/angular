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
  private subscription: Subscription = new Subscription();

  constructor(
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    this.subscription = this.suggestionService.suggestions$.subscribe(suggestions => {
      this.suggestions = suggestions;
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  viewDetails(id: number): void {
    this.router.navigate(["/suggestions", id]);
  }

  addSuggestion(): void {
    this.router.navigate(["/suggestions/add"]);
  }

  deleteSuggestion(id: number): void {
    this.suggestionService.deleteSuggestionLocal(id);
  }

  incrementLikes(id: number): void {
    this.suggestionService.updateLikesLocal(id);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'en_attente':
        return 'En attente';
      case 'acceptee':
        return 'Acceptée';
      case 'refusee':
        return 'Refusée';
      default:
        return status;
    }
  }
}

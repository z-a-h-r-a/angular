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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private suggestionService: SuggestionService
  ) {}

  ngOnInit(): void {
    const id = +this.route.snapshot.paramMap.get("id")!;
    this.suggestion = this.suggestionService.getSuggestionByIdLocal(id);
  }

  goBack(): void {
    this.router.navigate(["/suggestions"]);
  }

  updateSuggestion(): void {
    if (this.suggestion) {
      this.router.navigate(["/suggestions/add", this.suggestion.id]);
    }
  }
}

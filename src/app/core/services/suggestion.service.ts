import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Suggestion } from '../../models/suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  
  suggestionUrl = 'http://localhost:3000/suggestions';

  // Mock data for fallback (when backend is not available)
  private suggestionList: Suggestion[] = [
    { id: 1, title: 'Suggestion 1', description: 'Description 1', category: 'Category 1', date: new Date(), status: 'en_attente', nbLikes: 10 },
    { id: 2, title: 'Suggestion 2', description: 'Description 2', category: 'Category 2', date: new Date(), status: 'acceptee', nbLikes: 20 },
  ];

  constructor(private http: HttpClient) { }

  // Returns the list of suggestions from HTTP
  getSuggestionsList(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(this.suggestionUrl);
  }

  // Returns a suggestion by id from HTTP
  getSuggestionById(id: number): Observable<Suggestion> {
    return this.http.get<Suggestion>(`${this.suggestionUrl}/${id}`);
  }

  // Add a new suggestion via HTTP
  addSuggestion(suggestion: Suggestion): Observable<Suggestion> {
    return this.http.post<Suggestion>(this.suggestionUrl, suggestion);
  }

  // Update a suggestion via HTTP
  updateSuggestion(id: number, updatedSuggestion: Suggestion): Observable<Suggestion> {
    return this.http.put<Suggestion>(`${this.suggestionUrl}/${id}`, updatedSuggestion);
  }

  // Delete a suggestion via HTTP
  deleteSuggestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.suggestionUrl}/${id}`);
  }

  // Update likes for a suggestion via HTTP
  updateLikes(id: number): Observable<Suggestion> {
    const suggestion = this.suggestionList.find(s => s.id === id);
    if (suggestion) {
      suggestion.nbLikes++;
    }
    return this.http.patch<Suggestion>(`${this.suggestionUrl}/${id}`, { nbLikes: suggestion?.nbLikes });
  }

  // Fallback methods using local data (for when backend is not available)
  getSuggestionsListLocal(): Suggestion[] {
    return this.suggestionList;
  }

  getSuggestionByIdLocal(id: number): Suggestion | undefined {
    return this.suggestionList.find(s => s.id === id);
  }

  addSuggestionLocal(suggestion: Suggestion): void {
    const newId = Math.max(...this.suggestionList.map(s => s.id), 0) + 1;
    suggestion.id = newId;
    this.suggestionList.push(suggestion);
  }

  updateSuggestionLocal(id: number, updatedSuggestion: Suggestion): void {
    const index = this.suggestionList.findIndex(s => s.id === id);
    if (index !== -1) {
      this.suggestionList[index] = { ...updatedSuggestion, id };
    }
  }

  deleteSuggestionLocal(id: number): void {
    this.suggestionList = this.suggestionList.filter(s => s.id !== id);
  }

  updateLikesLocal(id: number): void {
    const suggestion = this.suggestionList.find(s => s.id === id);
    if (suggestion) {
      suggestion.nbLikes++;
    }
  }
}

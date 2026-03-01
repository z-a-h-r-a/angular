import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Suggestion } from '../../models/suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  
  private suggestionUrl = 'http://localhost:3000/suggestions';
  private bdUrl = '/bd.json';
  
  // BehaviorSubject to manage suggestions state
  private suggestionsSubject = new BehaviorSubject<Suggestion[]>([]);
  suggestions$ = this.suggestionsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadSuggestionsFromBd();
  }

  // Load suggestions from bd.json
  private loadSuggestionsFromBd(): void {
    this.http.get<any>(this.bdUrl).subscribe(data => {
      if (data && data.suggestions) {
        // Convert date strings to Date objects
        const suggestions = data.suggestions.map((s: any) => ({
          ...s,
          date: new Date(s.date)
        }));
        this.suggestionsSubject.next(suggestions);
      }
    });
  }

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
    return this.http.patch<Suggestion>(`${this.suggestionUrl}/${id}`, { nbLikes: id });
  }

  // Get suggestions from BehaviorSubject (from bd.json)
  getSuggestionsListLocal(): Suggestion[] {
    return this.suggestionsSubject.getValue();
  }

  getSuggestionByIdLocal(id: number): Suggestion | undefined {
    return this.suggestionsSubject.getValue().find(s => s.id === id);
  }

  addSuggestionLocal(suggestion: Suggestion): void {
    const currentSuggestions = this.suggestionsSubject.getValue();
    const newId = Math.max(...currentSuggestions.map(s => s.id), 0) + 1;
    suggestion.id = newId;
    this.suggestionsSubject.next([...currentSuggestions, suggestion]);
  }

  updateSuggestionLocal(id: number, updatedSuggestion: Suggestion): void {
    const currentSuggestions = this.suggestionsSubject.getValue();
    const index = currentSuggestions.findIndex(s => s.id === id);
    if (index !== -1) {
      const updatedSuggestions = [...currentSuggestions];
      updatedSuggestions[index] = { ...updatedSuggestion, id };
      this.suggestionsSubject.next(updatedSuggestions);
    }
  }

  deleteSuggestionLocal(id: number): void {
    const currentSuggestions = this.suggestionsSubject.getValue();
    const filteredSuggestions = currentSuggestions.filter(s => s.id !== id);
    this.suggestionsSubject.next(filteredSuggestions);
  }

  updateLikesLocal(id: number): void {
    const currentSuggestions = this.suggestionsSubject.getValue();
    const index = currentSuggestions.findIndex(s => s.id === id);
    if (index !== -1) {
      const updatedSuggestions = [...currentSuggestions];
      updatedSuggestions[index] = {
        ...updatedSuggestions[index],
        nbLikes: updatedSuggestions[index].nbLikes + 1
      };
      this.suggestionsSubject.next(updatedSuggestions);
    }
  }
}

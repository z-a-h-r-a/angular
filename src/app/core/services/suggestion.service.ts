import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Suggestion } from '../../models/suggestion';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  
  private suggestionUrl = 'http://localhost:3000/suggestions';
  
  // BehaviorSubject to manage suggestions state
  private suggestionsSubject = new BehaviorSubject<Suggestion[]>([]);
  suggestions$ = this.suggestionsSubject.asObservable();

  // HTTP options
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // ============================================
  // HTTP Methods using HttpClient
  // ============================================

  /**
   * Get all suggestions from the server
   * Method: GET
   */
  getSuggestionsList(): Observable<Suggestion[]> {
    return this.http.get<Suggestion[]>(this.suggestionUrl).pipe(
      tap(suggestions => {
        this.suggestionsSubject.next(suggestions);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Get a suggestion by ID from the server
   * Method: GET
   */
  getSuggestionById(id: number): Observable<Suggestion> {
    return this.http.get<Suggestion>(`${this.suggestionUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Add a new suggestion to the server
   * Method: POST
   */
  addSuggestion(suggestion: Suggestion): Observable<Suggestion> {
    return this.http.post<Suggestion>(this.suggestionUrl, suggestion, this.httpOptions).pipe(
      tap(newSuggestion => {
        const currentSuggestions = this.suggestionsSubject.getValue();
        this.suggestionsSubject.next([...currentSuggestions, newSuggestion]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update an existing suggestion on the server
   * Method: PUT
   */
  updateSuggestion(id: number, updatedSuggestion: Suggestion): Observable<Suggestion> {
    return this.http.put<Suggestion>(`${this.suggestionUrl}/${id}`, updatedSuggestion, this.httpOptions).pipe(
      tap(() => {
        const currentSuggestions = this.suggestionsSubject.getValue();
        const index = currentSuggestions.findIndex(s => s.id === id);
        if (index !== -1) {
          const updatedSuggestions = [...currentSuggestions];
          updatedSuggestions[index] = { ...updatedSuggestion, id };
          this.suggestionsSubject.next(updatedSuggestions);
        }
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Delete a suggestion from the server
   * Method: DELETE
   */
  deleteSuggestion(id: number): Observable<void> {
    return this.http.delete<void>(`${this.suggestionUrl}/${id}`).pipe(
      tap(() => {
        const currentSuggestions = this.suggestionsSubject.getValue();
        const filteredSuggestions = currentSuggestions.filter(s => s.id !== id);
        this.suggestionsSubject.next(filteredSuggestions);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Update the number of likes for a suggestion
   * Method: PATCH
   */
  updateLikes(id: number, newLikes: number): Observable<Suggestion> {
    return this.http.patch<Suggestion>(`${this.suggestionUrl}/${id}`, { nbLikes: newLikes }).pipe(
      tap(() => {
        const currentSuggestions = this.suggestionsSubject.getValue();
        const index = currentSuggestions.findIndex(s => s.id === id);
        if (index !== -1) {
          const updatedSuggestions = [...currentSuggestions];
          updatedSuggestions[index] = {
            ...updatedSuggestions[index],
            nbLikes: newLikes
          };
          this.suggestionsSubject.next(updatedSuggestions);
        }
      }),
      catchError(this.handleError)
    );
  }

  // ============================================
  // Local/Fallback Methods
  // ============================================

  /**
   * Get suggestions from the BehaviorSubject (local cache)
   */
  getSuggestionsListLocal(): Suggestion[] {
    return this.suggestionsSubject.getValue();
  }

  /**
   * Get a suggestion by ID from local cache
   */
  getSuggestionByIdLocal(id: number): Suggestion | undefined {
    return this.suggestionsSubject.getValue().find(s => s.id === id);
  }

  /**
   * Add a suggestion locally (for fallback)
   */
  addSuggestionLocal(suggestion: Suggestion): void {
    const currentSuggestions = this.suggestionsSubject.getValue();
    const newId = Math.max(...currentSuggestions.map(s => s.id), 0) + 1;
    suggestion.id = newId;
    this.suggestionsSubject.next([...currentSuggestions, suggestion]);
  }

  /**
   * Update a suggestion locally (for fallback)
   */
  updateSuggestionLocal(id: number, updatedSuggestion: Suggestion): void {
    const currentSuggestions = this.suggestionsSubject.getValue();
    const index = currentSuggestions.findIndex(s => s.id === id);
    if (index !== -1) {
      const updatedSuggestions = [...currentSuggestions];
      updatedSuggestions[index] = { ...updatedSuggestion, id };
      this.suggestionsSubject.next(updatedSuggestions);
    }
  }

  /**
   * Delete a suggestion locally (for fallback)
   */
  deleteSuggestionLocal(id: number): void {
    const currentSuggestions = this.suggestionsSubject.getValue();
    const filteredSuggestions = currentSuggestions.filter(s => s.id !== id);
    this.suggestionsSubject.next(filteredSuggestions);
  }

  /**
   * Update likes locally (for fallback)
   */
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

  // ============================================
  // Error Handling
  // ============================================

  /**
   * Handle HTTP errors
   */
  private handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}

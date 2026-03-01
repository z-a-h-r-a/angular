import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, of, map } from 'rxjs';

export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  dateOfBirth: string;
  bio: string;
  avatar: string;
}

export interface BdData {
  users: User[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = '/bd.json';
  private usersKey = 'bd_users';
  
  // Using signals for reactive state management
  private currentUserSignal = signal<User | null>(null);
  
  // Computed signal for authentication status
  readonly currentUser = this.currentUserSignal.asReadonly();
  readonly isLoggedIn = computed(() => this.currentUserSignal() !== null);

  constructor(private http: HttpClient, private router: Router) {
    this.checkStoredUser();
  }

  private checkStoredUser(): void {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      this.currentUserSignal.set(JSON.parse(storedUser));
    }
  }

  // Get all users - from localStorage first (persisted data), then fallback to bd.json
  getUsers(): Observable<BdData> {
    const storedUsers = localStorage.getItem(this.usersKey);
    
    if (storedUsers) {
      // Return stored users from localStorage
      return of({ users: JSON.parse(storedUsers) });
    }
    
    // Fallback to bd.json for initial data
    return this.http.get<BdData>(this.apiUrl).pipe(
      tap(data => {
        // Initialize localStorage with bd.json data
        localStorage.setItem(this.usersKey, JSON.stringify(data.users));
      })
    );
  }

  signIn(username: string, password: string): Observable<{ success: boolean; message: string; user?: User }> {
    return this.getUsers().pipe(
      tap(data => {
        const user = data.users.find(
          u => u.username === username && u.password === password
        );
        
        if (user) {
          this.currentUserSignal.set(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError(() => of({ success: false, message: 'Erreur de connexion au serveur' })),
      tap((response: any) => {
        if (response.users) {
          const user = response.users.find(
            (u: User) => u.username === username && u.password === password
          );
          
          if (user) {
            this.currentUserSignal.set(user);
            localStorage.setItem('currentUser', JSON.stringify(user));
          }
        }
      }),
      tap(() => {
        const user = this.currentUserSignal();
        if (user) {
          this.router.navigate(['/users/profile']);
        }
      })
    );
  }

  // Sign in check
  checkCredentials(username: string, password: string, callback: (result: { success: boolean; message: string; user?: User }) => void): void {
    this.getUsers().subscribe(data => {
      const foundUser = data.users.find(
        u => u.username === username && u.password === password
      );
      
      if (foundUser) {
        this.currentUserSignal.set(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        callback({ success: true, message: 'Connexion réussie!', user: foundUser });
        this.router.navigate(['/users/profile']);
      } else {
        callback({ success: false, message: 'Nom d\'utilisateur ou mot de passe incorrect' });
      }
    });
  }

  // Check if username or email already exists
  checkUsernameExists(username: string, email: string): Observable<boolean> {
    return this.getUsers().pipe(
      map(data => {
        return data.users.some(u => u.username === username || u.email === email);
      })
    );
  }

  // Register a new user - saves to localStorage for persistence
  registerUser(userData: Omit<User, 'id'>): Observable<any> {
    return this.getUsers().pipe(
      map(data => {
        // Generate new ID
        const maxId = data.users.reduce((max, u) => Math.max(max, u.id), 0);
        const newUser: User = {
          ...userData,
          id: maxId + 1
        };
        
        // Add to users array
        data.users.push(newUser);
        
        // Store in localStorage for persistence - THIS SAVES THE DATA
        localStorage.setItem(this.usersKey, JSON.stringify(data.users));
        
        console.log('User registered and saved:', newUser);
        console.log('All users:', data.users);
        
        return newUser;
      })
    );
  }

  // Get users from localStorage directly (for debugging)
  getStoredUsers(): User[] {
    const stored = localStorage.getItem(this.usersKey);
    return stored ? JSON.parse(stored) : [];
  }

  // Clear all stored users (for testing)
  clearStoredUsers(): void {
    localStorage.removeItem(this.usersKey);
    localStorage.removeItem('currentUser');
  }

  signOut(): void {
    this.currentUserSignal.set(null);
    localStorage.removeItem('currentUser');
    this.router.navigate(['/home']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }

  isAuthenticated(): boolean {
    return this.isLoggedIn();
  }
}

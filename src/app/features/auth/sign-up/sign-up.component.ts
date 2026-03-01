import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService, User } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  // Form fields
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  gender: string = '';
  dateOfBirth: string = '';
  bio: string = '';

  // UI state
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validation
    if (!this.username || !this.password || !this.confirmPassword || 
        !this.firstName || !this.lastName || !this.email) {
      this.errorMessage = 'Veuillez remplir tous les champs obligatoires';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Le mot de passe doit contenir au moins 6 caractères';
      return;
    }

    this.isLoading = true;

    // Check if username or email already exists
    this.authService.checkUsernameExists(this.username, this.email).subscribe({
      next: (exists) => {
        if (exists) {
          this.isLoading = false;
          this.errorMessage = 'Ce nom d\'utilisateur ou email existe déjà';
          return;
        }

        // Create new user
        const newUser: Omit<User, 'id'> = {
          username: this.username,
          password: this.password,
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.email,
          gender: this.gender || 'other',
          dateOfBirth: this.dateOfBirth || '',
          bio: this.bio || '',
          avatar: 'https://via.placeholder.com/150'
        };

        this.authService.registerUser(newUser).subscribe({
          next: () => {
            this.isLoading = false;
            this.successMessage = 'Compte créé avec succès! Redirection vers la connexion...';
            setTimeout(() => {
              this.router.navigate(['/auth/sign-in']);
            }, 2000);
          },
          error: (err) => {
            this.isLoading = false;
            this.errorMessage = 'Erreur lors de la création du compte';
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Erreur lors de la vérification';
        console.error(err);
      }
    });
  }
}

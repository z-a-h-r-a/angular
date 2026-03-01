import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    this.errorMessage = '';
    
    if (!this.username || !this.password) {
      this.errorMessage = 'Veuillez entrer un nom d\'utilisateur et un mot de passe';
      return;
    }

    this.isLoading = true;

    this.authService.checkCredentials(this.username, this.password, (result) => {
      this.isLoading = false;
      if (!result.success) {
        this.errorMessage = result.message;
      }
      // Navigation is handled in the service
    });
  }
}

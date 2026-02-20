import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
isInvalid(arg0: string): any {
throw new Error('Method not implemented.');
}

  editMode = false;

  user = {
    username: 'johndoe',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    gender: 'male',
    dateOfBirth: '1990-01-15',
    bio: 'Passionné par les nouvelles technologies.',
    avatar: 'https://via.placeholder.com/150'
  };

  profileForm!: FormGroup;

  selectedFile: File | null = null;
  imagePreview: string | null = null;

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      firstName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.pattern('^[a-zA-ZÀ-ÿ ]+$')]),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      gender: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      bio: new FormControl('')
    });

    this.loadUserData();
  }

  loadUserData() {
    this.profileForm.patchValue(this.user);
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.loadUserData();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.user = {
      ...this.user,
      ...this.profileForm.value,
      avatar: this.imagePreview ?? this.user.avatar
    };

    this.editMode = false;
    this.selectedFile = null;
    this.imagePreview = null;

    alert('Profil mis à jour avec succès !');
  }

  cancelEdit() {
    this.editMode = false;
    this.loadUserData();
    this.selectedFile = null;
    this.imagePreview = null;
  }
}

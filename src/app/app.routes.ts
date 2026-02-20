import { Routes } from '@angular/router';
import { SuggestionDetailsComponent } from './features/suggestions/suggestion-details/suggestion-details.component';
import { ProfileComponent } from './features/users/profile/profile.component';


export const routes: Routes = [
    {
    path: '',
    component: HomeComponent
    }
    {
        path: 'home',
        loadComponent: () =>
            import('./core/home/home.component')
            .then(m => m.HomeComponent)
    },
    {
        path: 'users/profile',
        loadComponent: () =>
            import('./features/users/profile/profile.component')
            .then(m => m.ProfileComponent)
    },
    {
        path: 'suggestions',
        loadComponent: () =>
            import('./features/suggestions/suggestion-list/suggestion-list.component')
            .then(m => m.SuggestionListComponent)
    },
    {
        path: 'favoris',
        loadComponent: () =>
            import('./core/favorites/favorites.component')
            .then(m => m.FavoritesComponent)
    },
    { path: 'suggestions/:id', component: SuggestionDetailsComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];

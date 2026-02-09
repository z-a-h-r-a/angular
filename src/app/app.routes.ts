import { Routes } from '@angular/router';
import { SuggestionDetailsComponent } from './features/suggestions/suggestion-details/suggestion-details.component';

export const routes: Routes = [
    {
    path: 'suggestions',
    loadComponent: () =>
        import('./features/suggestions/suggestion-list/suggestion-list.component')
        .then(m => m.SuggestionListComponent)
    },
    { path: 'suggestions/:id', component: SuggestionDetailsComponent },
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: '**', redirectTo: '/home' }
];

import { Routes } from '@angular/router';
import { PosteListComponent } from './components/poste/poste-list/poste-list.component';
import { ClientListComponent } from './components/client/client-list/client-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'postes', pathMatch: 'full' },
  { path: 'postes', component: PosteListComponent },
  { path: 'clients', component: ClientListComponent },
  { path: '**', redirectTo: 'postes' },
];

import { Routes } from '@angular/router';
import { PosteListComponent } from './components/poste/poste-list/poste-list.component';

export const routes: Routes = [
  { path: '', component: PosteListComponent },
  { path: '**', redirectTo: '' },
];

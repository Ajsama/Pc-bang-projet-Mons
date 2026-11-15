// Service Angular : point de passage vers l'API. Il ne fait que déléguer, aucune logique métier.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Poste, PosteCreateDto, PosteUpdateDto } from '../models/poste.model';

@Injectable({ providedIn: 'root' })
export class PosteService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/postes';

  // firstValueFrom transforme la réponse HTTP en Promise, pour pouvoir utiliser async / await

  getPostes(): Promise<Poste[]> {
    return firstValueFrom(this.http.get<Poste[]>(this.apiUrl));
  }

  getPosteById(id: number): Promise<Poste> {
    return firstValueFrom(this.http.get<Poste>(`${this.apiUrl}/${id}`));
  }

  addPoste(dto: PosteCreateDto): Promise<Poste> {
    return firstValueFrom(this.http.post<Poste>(this.apiUrl, dto));
  }

  updatePoste(id: number, dto: PosteUpdateDto): Promise<Poste> {
    return firstValueFrom(this.http.put<Poste>(`${this.apiUrl}/${id}`, dto));
  }

  deletePoste(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}

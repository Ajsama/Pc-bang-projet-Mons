// Service Angular : point de passage vers l'API. Il ne fait que déléguer, aucune logique métier.
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Client, ClientCreateDto, ClientUpdateDto } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/clients';

  getClients(): Promise<Client[]> {
    return firstValueFrom(this.http.get<Client[]>(this.apiUrl));
  }

  getClientById(id: number): Promise<Client> {
    return firstValueFrom(this.http.get<Client>(`${this.apiUrl}/${id}`));
  }

  addClient(dto: ClientCreateDto): Promise<Client> {
    return firstValueFrom(this.http.post<Client>(this.apiUrl, dto));
  }

  updateClient(id: number, dto: ClientUpdateDto): Promise<Client> {
    return firstValueFrom(this.http.put<Client>(`${this.apiUrl}/${id}`, dto));
  }

  deleteClient(id: number): Promise<void> {
    return firstValueFrom(this.http.delete<void>(`${this.apiUrl}/${id}`));
  }
}

// Carte d'un client (composant enfant) : affiche un client et prévient le parent quand on clique
import { Component, computed, input, output } from '@angular/core';
import { Client } from '../../../models/client.model';

@Component({
  selector: 'app-client-card',
  templateUrl: './client-card.component.html',
  styleUrl: './client-card.component.css',
})
export class ClientCardComponent {
  // input : donnée reçue du parent (parent → enfant)
  client = input.required<Client>();

  // output : événements envoyés au parent (enfant → parent), avec l'id du client
  edit = output<number>();
  delete = output<number>();

  // Initiales affichées dans la pastille (ex. « Lucas Dupont » → « LD »)
  initiales = computed(() => (this.client().prenom[0] + this.client().nom[0]).toUpperCase());

  // Date d'inscription au format belge (ex. 24/11/2026)
  inscription = computed(() => new Date(this.client().createdAt).toLocaleDateString('fr-BE'));
}

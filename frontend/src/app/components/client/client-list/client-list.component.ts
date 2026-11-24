// Liste des clients (composant parent)
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ClientService } from '../../../services/client.service';
import { Client } from '../../../models/client.model';
import { ClientCardComponent } from '../client-card/client-card.component';
import { ClientFormComponent } from '../client-form/client-form.component';

@Component({
  selector: 'app-client-list',
  imports: [ClientCardComponent, ClientFormComponent],
  templateUrl: './client-list.component.html',
  styleUrl: './client-list.component.css',
})
export class ClientListComponent implements OnInit {
  private clientService = inject(ClientService);

  // Signals : variables réactives, l'affichage se met à jour quand elles changent
  clients = signal<Client[]>([]);
  clientSelectionne = signal<Client | null>(null);
  afficherFormulaire = signal(false);
  recherche = signal('');
  erreur = signal('');

  // Signals calculés : se recalculent tout seuls quand la liste ou la recherche change
  nombreClients = computed(() => this.clients().length);
  clientsFiltres = computed(() => {
    const texte = this.recherche().trim().toLowerCase();
    if (!texte) return this.clients();
    return this.clients().filter((c) =>
      `${c.prenom} ${c.nom} ${c.email}`.toLowerCase().includes(texte),
    );
  });

  ngOnInit() {
    this.chargerClients();
  }

  async chargerClients() {
    try {
      this.clients.set(await this.clientService.getClients());
      this.erreur.set('');
    } catch {
      this.erreur.set("Impossible de joindre l'API. Le back-end est-il démarré ?");
    }
  }

  // Bouton « + Ajouter un client »
  ouvrirFormulaire() {
    this.clientSelectionne.set(null); // null = pas de modif → création
    this.afficherFormulaire.set(true);
  }

  // Bouton « Modifier » d'une carte
  async modifierClient(id: number) {
    const client = await this.clientService.getClientById(id); // on relit le client à jour en base
    this.clientSelectionne.set(client); // ≠ null → mode modification
    this.afficherFormulaire.set(true);
  }

  // Bouton « Supprimer » d'une carte
  async supprimerClient(id: number) {
    if (!confirm('Supprimer ce client ?')) return; // sécurité utilisateur
    try {
      await this.clientService.deleteClient(id);
      // On enlève le client de la liste sans tout recharger
      this.clients.set(this.clients().filter((c) => c.id !== id));
    } catch {
      this.erreur.set('Impossible de supprimer ce client.');
    }
  }

  // Le formulaire a enregistré : on recharge la liste et on ferme
  onSauvegarde() {
    this.chargerClients();
    this.fermerFormulaire();
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.clientSelectionne.set(null);
  }
}

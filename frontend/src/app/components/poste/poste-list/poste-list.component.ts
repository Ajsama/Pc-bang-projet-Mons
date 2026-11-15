// Liste des postes (composant parent) : le « plan de salle »
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { PosteService } from '../../../services/poste.service';
import { Poste, STATUTS } from '../../../models/poste.model';
import { PosteCardComponent } from '../poste-card/poste-card.component';
import { PosteFormComponent } from '../poste-form/poste-form.component';

@Component({
  selector: 'app-poste-list',
  imports: [PosteCardComponent, PosteFormComponent],
  templateUrl: './poste-list.component.html',
  styleUrl: './poste-list.component.css',
})
export class PosteListComponent implements OnInit {
  private posteService = inject(PosteService);

  // Signals : variables réactives, l'affichage se met à jour quand elles changent
  postes = signal<Poste[]>([]);
  posteSelectionne = signal<Poste | null>(null);
  afficherFormulaire = signal(false);
  erreur = signal('');

  // Signals calculés : se recalculent tout seuls quand la liste change
  nombrePostes = computed(() => this.postes().length);
  compteurs = computed(() =>
    STATUTS.map((s) => ({
      ...s,
      total: this.postes().filter((p) => p.statut === s.valeur).length,
    })),
  );

  ngOnInit() {
    this.chargerPostes();
  }

  async chargerPostes() {
    try {
      this.postes.set(await this.posteService.getPostes());
      this.erreur.set('');
    } catch {
      this.erreur.set("Impossible de joindre l'API. Le back-end est-il démarré ?");
    }
  }

  // Bouton « + Ajouter un poste »
  ouvrirFormulaire() {
    this.posteSelectionne.set(null); // null = pas de modif → création
    this.afficherFormulaire.set(true);
  }

  // Bouton « Modifier » d'une carte
  async modifierPoste(id: number) {
    const poste = await this.posteService.getPosteById(id); // on relit le poste à jour en base
    this.posteSelectionne.set(poste); // ≠ null → mode modification
    this.afficherFormulaire.set(true);
  }

  // Bouton « Supprimer » d'une carte
  async supprimerPoste(id: number) {
    if (!confirm('Supprimer ce poste ?')) return; // sécurité utilisateur
    try {
      await this.posteService.deletePoste(id);
      // On enlève le poste de la liste sans tout recharger
      this.postes.set(this.postes().filter((p) => p.id !== id));
    } catch {
      this.erreur.set('Impossible de supprimer ce poste.');
    }
  }

  // Le formulaire a enregistré : on recharge la liste et on ferme
  onSauvegarde() {
    this.chargerPostes();
    this.fermerFormulaire();
  }

  fermerFormulaire() {
    this.afficherFormulaire.set(false);
    this.posteSelectionne.set(null);
  }
}

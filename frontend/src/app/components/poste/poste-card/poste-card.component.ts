// Carte d'un poste (composant enfant) : affiche un poste et prévient le parent quand on clique
import { Component, computed, input, output } from '@angular/core';
import { Poste, STATUTS } from '../../../models/poste.model';

@Component({
  selector: 'app-poste-card',
  templateUrl: './poste-card.component.html',
  styleUrl: './poste-card.component.css',
})
export class PosteCardComponent {
  // input : donnée reçue du parent (parent → enfant)
  poste = input.required<Poste>();

  // output : événements envoyés au parent (enfant → parent), avec l'id du poste
  edit = output<number>();
  delete = output<number>();

  libelleStatut = computed(
    () => STATUTS.find((s) => s.valeur === this.poste().statut)?.libelle ?? this.poste().statut,
  );

  // Affiche le tarif au format belge : "3.5" → « 3,50 € »
  prix = computed(() => Number(this.poste().tarifHoraire).toFixed(2).replace('.', ',') + ' €');
}

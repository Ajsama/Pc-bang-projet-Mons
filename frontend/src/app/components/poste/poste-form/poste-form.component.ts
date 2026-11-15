// Formulaire d'un poste : UN SEUL formulaire sert à l'ajout et à la modification
import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PosteService } from '../../../services/poste.service';
import { Poste, PosteCreateDto, PosteUpdateDto, STATUTS } from '../../../models/poste.model';

@Component({
  selector: 'app-poste-form',
  imports: [ReactiveFormsModule],
  templateUrl: './poste-form.component.html',
  styleUrl: './poste-form.component.css',
})
export class PosteFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private posteService = inject(PosteService);

  // null → mode AJOUT ; un poste → mode MODIFICATION
  posteAModifier = input<Poste | null>(null);

  // Événements envoyés au parent (la liste)
  sauvegarde = output<Poste>();
  annuler = output<void>();

  statuts = STATUTS;
  erreur = signal('');

  // Formulaire réactif avec ses règles de validation
  form = this.fb.nonNullable.group({
    numero: [1, [Validators.required, Validators.min(1)]],
    type: ['Standard', Validators.required],
    tarifHoraire: [3.5, [Validators.required, Validators.min(0.5)]],
    statut: ['DISPONIBLE', Validators.required],
  });

  ngOnInit() {
    // En mode modification, on pré-remplit les champs avec les valeurs existantes
    const poste = this.posteAModifier();
    if (poste) {
      this.form.patchValue({
        numero: poste.numero,
        type: poste.type,
        tarifHoraire: Number(poste.tarifHoraire),
        statut: poste.statut,
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return; // garde : on n'envoie rien si le formulaire est invalide

    const values = this.form.getRawValue();
    const poste = this.posteAModifier();

    try {
      if (poste) {
        const updated = await this.posteService.updatePoste(poste.id, values as PosteUpdateDto);
        this.sauvegarde.emit(updated); // enfant → parent
      } else {
        const created = await this.posteService.addPoste(values as PosteCreateDto);
        this.sauvegarde.emit(created); // enfant → parent
      }
    } catch (e: any) {
      // Message renvoyé par l'API (ex. « Ce numéro de poste existe déjà. »)
      this.erreur.set(e.error?.message ?? "Erreur lors de l'enregistrement.");
    }
  }
}

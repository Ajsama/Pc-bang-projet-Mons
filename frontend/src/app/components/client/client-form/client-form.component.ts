// Formulaire d'un client : UN SEUL formulaire sert à l'ajout et à la modification
import { Component, OnInit, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../../services/client.service';
import { Client, ClientCreateDto, ClientUpdateDto } from '../../../models/client.model';

@Component({
  selector: 'app-client-form',
  imports: [ReactiveFormsModule],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.css',
})
export class ClientFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private clientService = inject(ClientService);

  // null → mode AJOUT ; un client → mode MODIFICATION
  clientAModifier = input<Client | null>(null);

  // Événements envoyés au parent (la liste)
  sauvegarde = output<Client>();
  annuler = output<void>();

  erreur = signal('');

  // Formulaire réactif avec ses règles de validation
  form = this.fb.nonNullable.group({
    nom: ['', [Validators.required, Validators.maxLength(50)]],
    prenom: ['', [Validators.required, Validators.maxLength(50)]],
    email: ['', [Validators.required, Validators.email]],
    telephone: [''],
  });

  ngOnInit() {
    // En mode modification, on pré-remplit les champs avec les valeurs existantes
    const client = this.clientAModifier();
    if (client) {
      this.form.patchValue({
        nom: client.nom,
        prenom: client.prenom,
        email: client.email,
        telephone: client.telephone ?? '',
      });
    }
  }

  async onSubmit() {
    if (this.form.invalid) return; // garde : on n'envoie rien si le formulaire est invalide

    const values = this.form.getRawValue();
    const dto = { ...values, telephone: values.telephone || null }; // champ vide → pas de téléphone
    const client = this.clientAModifier();

    try {
      if (client) {
        const updated = await this.clientService.updateClient(client.id, dto as ClientUpdateDto);
        this.sauvegarde.emit(updated); // enfant → parent
      } else {
        const created = await this.clientService.addClient(dto as ClientCreateDto);
        this.sauvegarde.emit(created); // enfant → parent
      }
    } catch (e: any) {
      // Message renvoyé par l'API (ex. « Cette adresse e-mail est déjà utilisée. »)
      this.erreur.set(e.error?.message ?? "Erreur lors de l'enregistrement.");
    }
  }
}

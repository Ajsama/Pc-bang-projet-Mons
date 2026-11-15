// Forme d'un poste, tel que l'API le renvoie
export type StatutPoste = 'DISPONIBLE' | 'OCCUPE' | 'MAINTENANCE' | 'HORS_SERVICE';

export interface Poste {
  id: number;
  numero: number;
  type: string;
  tarifHoraire: string; // les montants arrivent en texte (ex. "3.5") pour garder la précision
  statut: StatutPoste;
}

// DTO (Data Transfer Object) : forme des données envoyées à l'API
// Création : un Poste sans l'id (généré par la base)
export interface PosteCreateDto {
  numero: number;
  type: string;
  tarifHoraire: number;
  statut: StatutPoste;
}

// Modification : les mêmes champs, tous optionnels
export type PosteUpdateDto = Partial<PosteCreateDto>;

// Libellés affichés pour chaque statut
export const STATUTS: { valeur: StatutPoste; libelle: string }[] = [
  { valeur: 'DISPONIBLE', libelle: 'Disponible' },
  { valeur: 'OCCUPE', libelle: 'Occupé' },
  { valeur: 'MAINTENANCE', libelle: 'Maintenance' },
  { valeur: 'HORS_SERVICE', libelle: 'Hors service' },
];

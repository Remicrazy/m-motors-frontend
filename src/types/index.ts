export type UserRole = 'CLIENT' | 'ADMIN';
export type VehicleType = 'ACHAT' | 'LOCATION';
export type VehicleStatut = 'DISPONIBLE' | 'EN_COURS' | 'VENDU';
export type DossierType = 'ACHAT' | 'LOCATION';
export type DossierStatut = 'EN_ATTENTE' | 'EN_COURS' | 'VALIDE' | 'REFUSE';

export interface User {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  role: UserRole;
  createdAt: string;
}

export interface LldOption {
  assurance: boolean;
  assistance: boolean;
  entretien: boolean;
  controleTechnique: boolean;
  prixMensuel12: number | null;
  prixMensuel24: number | null;
  prixMensuel36: number | null;
}

export interface Vehicle {
  id: string;
  marque: string;
  modele: string;
  annee: number;
  km: number;
  prix: number;
  type: VehicleType;
  statut: VehicleStatut;
  description?: string;
  photos?: string[];
  lldOption?: LldOption;
  createdAt: string;
}

export interface Document {
  id: string;
  nom: string;
  type: string;
  url: string;
  createdAt: string;
}

export interface Dossier {
  id: string;
  type: DossierType;
  statut: DossierStatut;
  motifRefus?: string;
  dureeSouhaitee?: number;
  vehicle: Vehicle;
  client?: User;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

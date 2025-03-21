import { User } from "./user.model";

export interface RendezVousModel {
    _id: string;
    heure: string;
    date: string;
    status: 'en attente' | 'confirmé' | 'assigné' | 'annulé' | 'disponible' | 'réservé' | 'terminé';
    services: string;
    client: User;
    mecanicien: User[];
}
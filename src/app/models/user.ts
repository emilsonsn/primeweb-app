export interface User {
  id? : number;
  name : string;
  email : string;
  is_active : boolean;
  role : string;
  email_verified_at? : string;
  phone? : string;
  updated_at? : string;
  created_at? : string;
}

export interface UserPosition {
  id? : string,
  position : string
}

export interface UserSector {
  id? : number,
  sector : string
}

export interface UserCards {
  total: number;
  active: number;
  inactive: number;
}

export enum UserStatus {
	ATIVO = 'ACTIVE',
	INATIVO = 'INACTIVE',
	BLOQUEADO = 'BLOCKED',
}


export enum Positions { //Gerente/Gestor/Adm/Tiago
  Admin = 'Admin',
  Financial = 'Financial',
  Supplies = 'Supplies',
  Requester = 'Requester',

  SUPERVIRSOR = 'SUPERVISOR',
  SELLER = 'SELLER'
}

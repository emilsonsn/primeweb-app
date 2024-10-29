export interface User {
  id? : number;
  name : string;
  email : string;
  is_active : boolean;
  role : UserRoles | string;
  email_verified_at? : string;
  phone? : string;
  updated_at? : string;
  created_at? : string;
}

export enum UserRoles {
  Seller = 'Seller',
  Consultant = 'Consultant',
  Manager = 'Manager',
  Admin = 'Admin',
  Technical = 'Technical',
  Financial = 'Financial',
}

export enum UserStatus {
	ATIVO = 'ACTIVE',
	INATIVO = 'INACTIVE',
	BLOQUEADO = 'BLOCKED',
}

// Garbage v

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


export enum Positions { //Gerente/Gestor/Adm/Tiago
  Admin = 'Admin',
  Financial = 'Financial',
  Supplies = 'Supplies',
  Requester = 'Requester',

  SUPERVIRSOR = 'SUPERVISOR',
  SELLER = 'SELLER'
}

import { Segment } from "./segment";
import { User } from "./user";

export interface Contact {
	id: number;
  name : string;
  enterprise : string;
  domain : string;
  segment : Segment;
  telephones : Telephone[];
  emails : Email[];
  segments : Segment[];
  responsible : string;
  created_at : string;
  return_date : string;
  status : string;
  origin : string;
  cnpj : string;
  consultant : User;
}

export interface Telephone {
  id?: number;
  name: string;
}

export interface Email {
  id?: number;
  email: string;
}

export enum ContactStatus {
  LEAD = 'LEAD',
  CONVERTEDTOCONTACT = 'CONVERTEDTOCONTACT',
  LOST = 'LOST',
  CLOSED = 'CLOSED',
  NEGOTIATION = 'NEGOTIATION',
  VISIT_SCHEDULING = 'VISIT_SCHEDULING',
  REISIT_SCHEDULING = 'REVISIT_SCHEDULING',
}

export enum ContactOrigin {
  INDICATION = 'INDICATION',
  EMAIL_MARKETING = 'EMAIL_MARKETING',
  CONSULTANT = 'CONSULTANT',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  RETURN = 'RETURN',
  GOOGLE = 'GOOGLE',
  CONTACT_FILTER = 'CONTACT_FILTER',
  OTHER = 'OTHER',
}

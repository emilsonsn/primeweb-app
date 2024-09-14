import { Segment } from "chart.js/dist/helpers/helpers.segment";
import { User } from "./user";

export interface Contact {
	id: number;
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

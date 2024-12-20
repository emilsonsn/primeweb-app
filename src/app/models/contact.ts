import { Occurrence } from './occurrence';
import { Segment } from './segment';
import { User } from './user';

export interface Contact {
  id?: number;
  user_id: number;
  user : User;
  company: string;
  domain: string;
  responsible: string;
  origin: string;
  return_date: string;
  return_time: string;
  cnpj: string;
  cep: string;
  street: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  observations?: string;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string;
  phones: Phone[]
  emails: Email[];
  segments: SegmentsContact[];
  occurrences: Occurrence[];
}

export interface Phone {
  phone : string;
  contact_id : number;
}

export interface Email {
  contact_id: number;
  email: string;
}

export interface SegmentsContact {
  contact_id: number;
  segment_id: number;
  segment : Segment;
}

export enum ContactOriginEnum {
  INDICATION = 'INDICATION',
  EMAIL_MARKETING = 'EMAIL_MARKETING',
  CONSULTANT = 'CONSULTANT',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
  RETURN = 'RETURN',
  GOOGLE = 'GOOGLE',
  CONTACT_FILTER = 'CONTACT_FILTER',
  OTHER = 'OTHER',
}

export enum ContactOccurenceEnum {
  Lead = "Lead",
  PresentationVisit = "PresentationVisit",
  SchedulingVisit = "SchedulingVisit",
  ReschedulingVisit = "ReschedulingVisit",
  DelegationContact = "DelegationContact",
  MeetingScheduling = "MeetingScheduling",
  Meetingrescheduling = "Meetingrescheduling",
  InNegotiation = "InNegotiation",
  Closed = "Closed",
  Lost = "Lost"
}

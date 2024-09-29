export interface Occurrence {
  id: number;
  user_id: number;
  phone_call_id: number;
  contact_id: number;
  date: string;
  time: string;
  status : OccurrenceStatusEnum;
  link: string;
  observations: string;
}

export enum OccurrenceStatusEnum {
  Lead = "Lead",
  PresentationVisit = "PresentationVisit",
  ConvertedContact = "ConvertedContact",
  SchedulingVisit = "SchedulingVisit",
  ReschedulingVisit = "ReschedulingVisit",
  DelegationContact = "DelegationContact",
  InNegotiation = "InNegotiation",
  Closed = "Closed",
  Lost = "Lost"
}

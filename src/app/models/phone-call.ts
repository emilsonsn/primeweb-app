export interface PhoneCall {
  id?: number;
  user_id: 1;
  company: string;
  phone: string;
  domain: string;
  email: string;
  return_date: string;
  return_time: string;
  status? : PhoneCallStatus;
  observations?: string;
  created_at? : string;
  updated_at? : string;
}

export enum PhoneCallStatus {
  LEAD = 'LEAD',
  CONVERTEDTOCONTACT = 'CONVERTEDTOCONTACT',
  LOST = 'LOST',
}

export interface PhoneCall {
	id: number;
  name : string;
  enterprise : string;
  domain : string;
  telephone : string;
  responsible : string;
  created_at : string;
  return_date : string;
  status : string;
}

export enum PhoneCallStatus {
  LEAD = 'LEAD',
  CONVERTEDTOCONTACT = 'CONVERTEDTOCONTACT',
  LOST = 'LOST'
}

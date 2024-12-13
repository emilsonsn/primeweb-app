export interface Client {
  id?: number;
  company: string;
  name: string;
  cpf_cnpj: string;
  phone: number;
  whatsapp: number;
  email: string;
  address: string;
  city: string;
  state: string;
  created_at?: Date;
  updated_at?: Date;
}

export enum ClientStatusEnum {
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  FINISHED = 'FINISHED',
  CANCELED = 'CANCELED'
}

import { User } from "./user";

export interface Segment {
  id?: 1;
  name: string;
  status: SegmentStatus;
  user_id?: 1;
  user? : User;
  updated_at?: string;
  created_at?: string;
}

export enum SegmentStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

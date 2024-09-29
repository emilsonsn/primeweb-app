import {User} from "./user";

export interface Segment {
  id?: 1;
  name: string;
  status: SegmentStatus;
  user_id?: 1;
  user?: User;
  updated_at?: string;
  created_at?: string;
  segment: {
    id: number,
    user_id: number,
    name: string,
    status: string,
    created_at: Date
  }
}

export enum SegmentStatus {
  Active = 'Active',
  Inactive = 'Inactive',
}

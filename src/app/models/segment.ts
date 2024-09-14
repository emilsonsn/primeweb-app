export interface Segment {
	id: number;
  name : string;
  status: string;
  created_by : string,
  created_at: string;
}

export enum SegmentStatus {
  BLOCKED = 'BLOCKED',
  RELEASED = 'RELEASED',
}

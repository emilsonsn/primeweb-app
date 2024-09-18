import { User } from "./user";

export interface Log {
  id : number;
  action : string;
  ip : string;
  user_id : number;
  user : User;
  updated_at? : string;
  created_at? : string;
}

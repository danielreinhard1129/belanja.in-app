import { User } from "./user.type";

export interface StoreAdmin {
  id: number;
  userId: number;
  nip: number;
  user: User;
}

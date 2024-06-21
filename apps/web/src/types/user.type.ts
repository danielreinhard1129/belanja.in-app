export interface User {
  id: number;
  name: string;
  email: string;
  addressId: number;
  role: string;
  provider: string;
  token: string;
  birthDate?: Date;
  gender: string;
  password: string;
  isVerified: boolean;
  referral: string;
  createdAt: Date;
  updatedAt: Date;
  avatarUrl?: string;
}

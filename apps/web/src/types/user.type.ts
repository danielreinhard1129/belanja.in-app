export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  referral: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  addressId: number;
  avatarUrl?: string;
  provider?: string;
  token?: string;
}

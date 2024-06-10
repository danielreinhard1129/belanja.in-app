import { User } from "@/types/user.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: Omit<User, "createdAt" | "updatedAt"> = {
  id: 0,
  name: "",
  email: "",
  password: "",
  addressId: 0,
  role: "",
  isVerified: false,
  referral: "",
  avatarUrl: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.role = action.payload.role;
      state.referral = action.payload.referral;
    },
    logoutAction: (state) => {
      state.id = 0;
      state.name = "";
      state.email = "";
      state.role = "";
      state.referral = "";
    },
  },
});

export const { loginAction, logoutAction } = userSlice.actions;

export default userSlice.reducer;

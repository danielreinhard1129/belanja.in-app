import { User } from "@/types/user.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: Omit<
  User,
  "createdAt" | "updatedAt" | "isVerified" | "password" | "referral"
> = {
  id: 0,
  name: "",
  email: "",
  addressId: 0,
  role: "",
  provider: "",
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAction: (
      state,
      action: PayloadAction<{ user: User; token: string }>,
    ) => {
      const { user, token } = action.payload;
      Object.assign(state, user);
      state.token = token;
    },
    logoutAction: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { loginAction, logoutAction } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;

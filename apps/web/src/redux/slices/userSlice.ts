import { User } from "@/types/user.type";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const initialState: User = {
  id: 0,
  name: "",
  email: "",
  addressId: 0,
  role: "",
  provider: "",
  token: "",
  birthDate: new Date(),
  gender: "",
  password: "",
  isVerified: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  referral: "",
  avatarUrl: undefined,
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
    setUser: (state, action: PayloadAction<User>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    logoutAction: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { loginAction, logoutAction, setUser } = userSlice.actions;

const userReducer = userSlice.reducer;
export default userReducer;

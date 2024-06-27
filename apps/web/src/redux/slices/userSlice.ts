import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface UserState {
  id: number;
  name: string;
  email: string;
  avatarUrl?: string;
  birthDate?: Date;
  provider?: string;
  role: string;
  gender?: string;
}

const initialState: UserState = {
  id: 0,
  name: "",
  email: "",
  role: "",
  avatarUrl: "",
  birthDate: new Date(),
  provider: "",
  gender: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
    },
    logoutAction: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { loginAction, logoutAction } = userSlice.actions;

export default userSlice.reducer;

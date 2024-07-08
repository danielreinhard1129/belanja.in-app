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
  token?: string;
  cartCounter?: number;
}

const initialState: UserState = {
  id: 0,
  name: "",
  email: "",
  role: "",
  avatarUrl: "",
  birthDate: undefined,
  provider: "",
  gender: "",
  token: "",
  cartCounter: 0,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginAction: (state, action: PayloadAction<UserState>) => {
      const {
        id,
        name,
        email,
        role,
        avatarUrl,
        birthDate,
        gender,
        provider,
        token,
        cartCounter,
      } = action.payload;
      state.id = id;
      state.email = email;
      state.name = name;
      state.role = role;
      state.avatarUrl = avatarUrl;
      state.birthDate = birthDate;
      state.gender = gender;
      state.provider = provider;
      state.token = token;
      state.cartCounter = cartCounter;
    },
    logoutAction: (state) => {
      state.id = 0;
      state.email = "";
      state.name = "";
      state.role = "";
      state.avatarUrl = "";
      state.birthDate = undefined;
      state.gender = "";
      state.provider = "";
      state.token = "";
      state.cartCounter = 0;
    },
    setCartCounterAction: (
      state,
      action: PayloadAction<Pick<UserState, "cartCounter">>,
    ) => {
      state.cartCounter = action.payload.cartCounter;
    },
  },
});

export const { loginAction, logoutAction,setCartCounterAction } = userSlice.actions;

export default userSlice.reducer;

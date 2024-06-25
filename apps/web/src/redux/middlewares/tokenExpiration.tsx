import { Middleware } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { logoutAction } from "../slices/userSlice";

interface DecodedToken {
  exp: number;
}

const tokenExpirationMiddleware: Middleware =
  (store) => (next) => (action: any) => {
    const state = store.getState();
    const token = state.user.token;

    if (action.type !== logoutAction.type && token) {
      const decodedToken: DecodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        store.dispatch(logoutAction());
      }
    }

    return next(action);
  };

export default tokenExpirationMiddleware;

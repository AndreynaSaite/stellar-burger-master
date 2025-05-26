import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from "@api";

import { createSlice, createAsyncThunk, SerializedError } from "@reduxjs/toolkit";
import { TUser } from "@utils-types";
import { clearTokens, storeTokens } from "../../utils/cookie";

type UserState = {
  user: TUser;
  authenticated: boolean;
  authChecked: boolean;
  authErrors: {
    login?: SerializedError;
    register?: SerializedError;
  };
};


const defaultUserState: UserState = {
  user: {
    email: "",
    name: ""
  },
  authenticated: false,
  authChecked: false,
  authErrors: {}
};


export const signupUser = createAsyncThunk("auth/signup", async (formData: TRegisterData) => {
  const res = await registerUserApi(formData);
  storeTokens(res.refreshToken, res.accessToken);
  return res.user;
});

export const signinUser = createAsyncThunk("auth/signin", async (data: TLoginData) => {
  const res = await loginUserApi(data);
  storeTokens(res.refreshToken, res.accessToken);
  return res.user;
});

export const signoutUser = createAsyncThunk("auth/signout", async (_) => {
  const res = await logoutApi();
  clearTokens();
});

export const retrieveUser = createAsyncThunk("auth/getUser", async (_) => {
  const res = await getUserApi();
  return res.user;
});

export const editUser = createAsyncThunk("auth/updateUser", async (data: Partial<TRegisterData>) => {
  const res = await updateUserApi(data);
  return res.user;
});


const authSlice = createSlice({
  name: "auth",
  initialState: defaultUserState,
  reducers: {},
  extraReducers: (state) => {
    state.addCase(signupUser.pending, (s) => {
      s.authErrors.register = undefined;
    });
    state.addCase(signupUser.fulfilled, (s, a) => {
      s.user = a.payload;
      s.authenticated = true;
      s.authErrors.register = undefined;
    });
    state.addCase(signupUser.rejected, (s, a) => {
      s.authErrors.register = a.meta.rejectedWithValue ? (a.payload as SerializedError) : a.error;
    });

    state.addCase(signinUser.pending, (s) => {
      s.authErrors.login = undefined;
    });
    state.addCase(signinUser.fulfilled, (s, a) => {
      s.user = a.payload;
      s.authenticated = true;
      s.authErrors.login = undefined;
    });
    state.addCase(signinUser.rejected, (s, a) => {
      s.authErrors.login = a.meta.rejectedWithValue ? (a.payload as SerializedError) : a.error;
    });

    state.addCase(signoutUser.fulfilled, (s) => {
      s.user = { name: "", email: "" };
      s.authenticated = false;
    });

    state.addCase(retrieveUser.fulfilled, (s, a) => {
      s.user = a.payload;
      s.authenticated = true;
      s.authChecked = true;
    });
    state.addCase(retrieveUser.rejected, (s) => {
      s.authChecked = true;
    });

    state.addCase(editUser.fulfilled, (s, a) => {
      s.user = a.payload;
    });
  }
});

export const reducer = authSlice.reducer;
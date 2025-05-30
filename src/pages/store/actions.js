import { SET_TOKEN } from "./constants";

export const setToken = (payload) => ({
  type: SET_TOKEN,
  payload,
});

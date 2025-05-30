import { SET_TOKEN, SET_CART_ITEMS_COUNT, SET_USER_DISCOUNT, SET_USER_MAX_DISCOUNT } from "./constants";

export const setToken = (payload) => ({
  type: SET_TOKEN,
  payload,
});

export const setCartItemsCount = (payload) => ({
  type: SET_CART_ITEMS_COUNT,
  payload,
});

export const setUserDiscount = (payload) => ({
  type: SET_USER_DISCOUNT,
  payload,
});

export const setUserMaxDiscount = (payload) => ({
  type: SET_USER_MAX_DISCOUNT,
  payload,
});

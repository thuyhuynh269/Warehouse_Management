import { getToken } from "../../components/constants";
import {
  SET_TOKEN,
  SET_CART_ITEMS_COUNT,
  SET_USER_DISCOUNT,
  SET_USER_MAX_DISCOUNT
} from "./constants";

const initState = {
  token: getToken() ?? "",
  cartItemsCount: 0,
  userDiscount: 0,
  userMaxDiscount: 0
};

function reducer(state, action) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    case SET_CART_ITEMS_COUNT:
      return {
        ...state,
        cartItemsCount: action.payload,
      };
    case SET_USER_DISCOUNT:
      return {
        ...state,
        userDiscount: action.payload,
      };
      case SET_USER_MAX_DISCOUNT:
      return {
        ...state,
        userMaxDiscount: action.payload,
      };
    default:
      throw new Error("Invalid action.");
  }
}

export { initState };
export default reducer;

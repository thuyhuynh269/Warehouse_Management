import { getToken } from "../../components/constants";
import {
  SET_TOKEN
} from "./constants";

const initState = {
  token: getToken() ?? ""
};

function reducer(state, action) {
  switch (action.type) {
    case SET_TOKEN:
      return {
        ...state,
        token: action.payload,
      };
    default:
      throw new Error("Invalid action.");
  }
}

export { initState };
export default reducer;

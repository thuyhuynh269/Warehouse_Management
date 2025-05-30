import { getToken, removeToken } from '../constants'
import { toast } from 'react-toastify'



const logout = (navigate) => {
  const token = getToken();

  if (token) {
    removeToken();
    navigate("/");

    toast.success('Logout successful');
  }
};

export default logout;

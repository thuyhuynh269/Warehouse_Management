import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";

import { useState, useEffect } from "react";
import { Button, Input } from "../components/ui";
import * as request from "../utils/request";
import { useStore, actions } from "../pages/store";
import { setToken } from "../components/constants";
import { getClientId } from "../components/constants";

const Login = () => {
  const [clientId, setClientId] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const [state, dispatch] = useStore();

  useEffect(() => {
    setError("");
  }, [username, password]);

  useEffect(() => {
    const token = state.token;

    if (token) navigate("/");
  });

  useEffect(() => {
    setClientId(getClientId())
  }, []);
  
  const handleSubmit = (event) => {
    event.preventDefault();

    request
      .post("auth/login", {
        username: username,
        password: password,
      })
      .then((response) => {
        if (!response) {
          setError("Can't connecting to server.");
          toast.error(`Login failed: ${error.response.data}`);
          return;
        }

        const token = response.token;
        setToken(token, 604800000);
        
        const from = location.state?.from?.pathname || "/";
        navigate(from, { replace: true });

        dispatch(actions.setToken(token));

        toast.success("Login successful");
      })
      .catch((error) => {
        setError(error.response.data);
        toast.error(`Login failed: ${error.response.data}`);
      });
  };

//   const handleSuccess = (response) => {
//     request
//       .post("auth/google-login", {
//         tokenId: response.credential,
//       })
//       .then((response) => {
//         if (response.token) {
//           const token = response.token;
//           setToken(token, 604800000);

//           const from = location.state?.from?.pathname || "/";
//           navigate(from, { replace: true });

//           dispatch(actions.setToken(token));
//           toast.success("Login successful");
//         } else {
//           toast.error("Login failed");
//         }
//       })
//       .catch((error) => {
//         console.error("Backend error", error);
//         toast.error("Login failed: " + error.message);
//       });
//   };

 
  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="bg-white p-12 rounded shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center">Pharma Shop</h1>
        <h2 className="text-xl font-bold mb-6 text-center">
          Login to start shopping
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 sm:text-sm"
              placeholder="Enter username"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 sm:text-sm"
              placeholder="Enter password"
            />
          </div>
          <label className="block text-sm font-medium text-red-700">
            {error}
          </label>
          <Button type="submit" primary className={"px-8 rounded-lg mt-4"}>
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

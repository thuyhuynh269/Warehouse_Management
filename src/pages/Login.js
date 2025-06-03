import { toast } from "react-toastify";

import { useState, useEffect } from "react";
import { Button, Input } from "../components/ui";
import * as request from "../utils/request";
import { getToken, setToken } from "../components/constants";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  //const [state, dispatch] = useStore();

  useEffect(() => {
    setError("");
  }, [username, password]);

  useEffect(() => {
    const token = getToken();

    if (token) 
      window.location.href = '/';
  });
  
  const handleSubmit = (event) => {
  event.preventDefault();
  request
    .post("Employee/login", {
      username: username,
      password: password,
    })
    .then((response) => {
      if (!response || !response.token) {
        setError("Can't connect to server or no token received.");
        toast.error("Login failed: Invalid response");
        return;
      }

      const token = response.token;
      setToken(token, 604800000); // Lưu token với thời hạn 7 ngày
      toast.success("Login successful");
      window.location.href = '/';
    })
    .catch((error) => {
      const errorMessage = error.response?.data || "An error occurred";
      setError(errorMessage);
      toast.error(`Login failed: ${errorMessage}`);
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
        <h1 className="text-3xl font-bold mb-6 text-center">WAREHOUSE MANAGEMENT</h1>
        <h2 className="text-xl font-bold mb-6 text-center">
          Login to start managing your warehouse
        </h2>
        <form onSubmit={handleSubmit} className=" text-center">
          <div className="mb-4 text-left">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Tên đăng nhập
            </label>
            <Input
              type="text"
              id="username"
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 sm:text-sm"
              placeholder="Nhập tên đăng nhập"
            />
          </div>
          <div className="mb-6 text-left">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Mật khẩu
            </label>
            <Input
              type="password"
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-green-500 sm:text-sm"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <label className="block text-sm font-medium text-red-700">
            {error}
          </label>
          <Button type="submit" primary className={"px-8 rounded-lg mt-4"}>
            Đăng nhập
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;

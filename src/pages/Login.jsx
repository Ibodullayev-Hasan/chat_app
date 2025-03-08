import { useState } from "react";
import { useAuth } from "../context/auth";
import { postDataMutation } from "../services/post.service";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { token, setToken } = useAuth();
  const { mutate: userLogin } = postDataMutation("user");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    userLogin(
      { url: "auth/login", body: formData },
      {
        onSuccess: (res) => {
          if (res?.accToken) {
            setToken(res.accToken);

            localStorage.setItem("accToken", JSON.stringify(res.accToken)); 

            localStorage.setItem("refToken", JSON.stringify(res.refToken));
          }
        },
      }
    );

    try {
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">Kirish</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Emailni kiriting"
              required
            />
          </div>
          <div>
            <label className="block text-gray-600 text-sm mb-1">Parol</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Parolni kiriting"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Kirish
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

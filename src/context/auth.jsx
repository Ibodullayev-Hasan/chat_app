import React from "react";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { postRefetchMutation } from "../services/post.service";
import { getData } from "../services/get.service";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("access_token"));
  const { mutate: postRefresh } = postRefetchMutation("user");

  // Token yo'q bo'lsa, uni localStorage'dan o'chirish
  useEffect(() => {
    if (!token) {
      localStorage.removeItem("accToken");
      localStorage.removeItem("refToken");
    }
  }, [token]);

  // API'dan user ma'lumotlarini olish
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["user"],
    queryFn: async () => getData(`users`),
    enabled: !!token,
  });

  // Xatoliklar bo‘lsa, tokenni yangilash yoki foydalanuvchini chiqarish
  useEffect(() => {
    if (data === 403 || data === 404) {
      setToken(null);
      router("/");
    }

    if (data == 401) {
      const refreshToken = JSON.parse(localStorage.getItem("refToken"));
      console.log(`refresh token: ${refreshToken}`);

      if (refreshToken) {
        postRefresh(
          {
            url: `auth/refresh`,
          },
          {
            onSuccess: (res) => {
              if (res?.accToken) {
                localStorage.setItem("accToken", JSON.stringify(res?.accToken));
                setToken(res?.accToken);
                refetch();
              }
              if (res?.status == 403) {
                setToken(null);
                router("/");
              }
            },
            onError: (error) => {
              console.error(error);
              throw new Error(error.message);
            },
          }
        );
      }
    }
  }, [data]);

  return (
    <AuthContext.Provider value={{ token, setToken, data, isLoading, refetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

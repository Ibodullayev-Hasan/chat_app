import React from "react";
import { useAuth } from "../context/auth";

const Home = () => {
  const { data } = useAuth();
  const user = data?.[0]; // Massiv ichidagi birinchi elementni olish

  return (
    <>
      <img src={user?.avatar_uri} alt="Avatar" width={100} height={100} />
      <p>Ismi: {user?.full_name}</p>
      <p>Ismi: {user?.full_name}</p>
      <p>Email: {user?.email}</p>
    </>
  );
};

export default Home;

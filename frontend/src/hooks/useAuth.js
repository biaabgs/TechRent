"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuth(nivelExigido) {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("techrent_token");
    const usuario = JSON.parse(localStorage.getItem("techrent_user") || "null");

    if (!token || !usuario) {
      router.replace("/");
      return;
    }

    if (nivelExigido && usuario.nivel_acesso !== nivelExigido) {
      router.replace("/unauthorized");
      return;
    }

    setPronto(true);
  }, []);

  return { pronto };
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { STORAGE_TOKEN_KEY, STORAGE_USER_KEY } from "@/services/auth.service"; 

export function useAuth(nivelExigido) {
  const router = useRouter();
  const [pronto, setPronto] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const userRaw = localStorage.getItem(STORAGE_USER_KEY);
    
    let usuario = null;
    try {
      usuario = JSON.parse(userRaw || "null");
    } catch (e) {
      usuario = null;
    }

    if (!token || !usuario) {
      router.replace("/");
      return;
    }

    if (nivelExigido && usuario.nivel_acesso !== nivelExigido) {
      router.replace("/");
      return;
    }

    setPronto(true);
  }, [nivelExigido, router]);

  return { pronto };
}
"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("8d7e9695-5f97-44db-a5b4-278f5498bae9");
  }, []);

  return null;
};
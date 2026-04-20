"use client";
import React from "react";
import type { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/store";

export function StoreProvider({ children }: { readonly children: ReactNode }): React.ReactNode {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}

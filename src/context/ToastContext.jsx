import React, { createContext, useContext } from "react";
import { useToast } from "../hooks/useToast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const toast = useToast();
  return <ToastContext.Provider value={toast}>{children}</ToastContext.Provider>;
}

export function useToastContext() {
  const context = useContext(ToastContext);
  if (!context) {
    // Return a default implementation if not in provider (for graceful degradation)
    return {
      toasts: [],
      showToast: () => {},
      removeToast: () => {},
    };
  }
  return context;
}


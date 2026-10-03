import { useState } from "react";

// Hook léger de gestion des notifications toast
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const toast = ({ title, description, variant = "default" }) => {
    // Logique temporaire avec alert en attendant un composant UI complet
    if (variant === "destructive") {
      alert(` ${title}\n${description || ""}`);
    } else {
      alert(` ${title}\n${description || ""}`);
    }

    // Préparation pour un système d'état de toasts
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, description, variant }]);
  };

  return { toast, toasts };
};
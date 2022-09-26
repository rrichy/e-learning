import ConfirmationDialog from "@/components/organisms/ConfirmationDialog";
import { ConfirmAttributes } from "@/interfaces/ConfirmDialog";
import React, { createContext, useState } from "react";

export const ConfirmContext = createContext<
  | [
      ConfirmAttributes | null,
      React.Dispatch<React.SetStateAction<ConfirmAttributes>> | null
    ]
>([null, null]);

const ConfirmContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [confirm, setConfirm] = useState<ConfirmAttributes>({
    prompt: "",
    isOpen: false,
    proceed: null,
    cancel: null,
    options: {},
  });

  return (
    <ConfirmContext.Provider value={[confirm, setConfirm]}>
      <ConfirmationDialog />
      {children}
    </ConfirmContext.Provider>
  );
};

export default ConfirmContextProvider;

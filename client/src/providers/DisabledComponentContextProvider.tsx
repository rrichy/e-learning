import Loading from "@/components/molecules/Loading";
import React, { createContext } from "react";

export const DisabledComponentContext = createContext(false);

function DisabledComponentContextProvider({
  value,
  showLoading,
  children,
}: {
  value: boolean;
  showLoading?: boolean;
  children: React.ReactNode;
}) {
  return (
    <DisabledComponentContext.Provider value={value}>
      {children}
      <Loading loading={value && showLoading} />
    </DisabledComponentContext.Provider>
  );
}

export default DisabledComponentContextProvider;

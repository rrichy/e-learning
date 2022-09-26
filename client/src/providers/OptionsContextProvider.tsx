import { OptionAttribute } from "@/interfaces/CommonInterface";
import React, { createContext } from "react";

export const OptionsContext = createContext<{ [key: string]: OptionAttribute[] }>(
  {}
);

function OptionsContextProvider({
  options,
  children,
}: {
  options: { [key: string]: OptionAttribute[] };
  children: React.ReactNode;
}) {
  return (
    <OptionsContext.Provider value={options}>
      {children}
    </OptionsContext.Provider>
  );
}

export default OptionsContextProvider;

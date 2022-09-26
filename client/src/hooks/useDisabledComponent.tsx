import { DisabledComponentContext } from "@/providers/DisabledComponentContextProvider";
import { useContext } from "react";

function useDisabledComponent() {
  return useContext(DisabledComponentContext);
}

export default useDisabledComponent;
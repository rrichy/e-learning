import { OptionsContext } from "@/providers/OptionsContextProvider";
import { useContext } from "react";

function useOptions() {
  return useContext(OptionsContext);
}

export default useOptions;

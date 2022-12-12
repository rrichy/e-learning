import { useContext, useEffect, useState } from "react";
import { ConfirmContext } from "@/providers/ConfirmContextProvider";
import {
  CommonContentAttributes,
  ConfirmOptionsAttributes,
} from "@/interfaces/ConfirmDialog";

const useConfirm = () => {
  const [confirm, setConfirm] = useContext(ConfirmContext);
  const [needsCleanup, setNeedsCleanup] = useState(false);

  const isConfirmed = (
    prompt: React.ReactNode | CommonContentAttributes,
    options?: ConfirmOptionsAttributes
  ) => {
    const promise = new Promise((resolve, reject) => {
      if (setConfirm) {
        setConfirm({
          prompt,
          isOpen: true,
          proceed: resolve as any,
          cancel: reject as any,
          options: options || {},
        });
        setNeedsCleanup(true);
      }
    });

    const reset = () => {
      if (setConfirm) {
        setConfirm({
          prompt,
          proceed: null,
          cancel: null,
          isOpen: false,
          options: options || {},
        });
        setNeedsCleanup(false);
      }
    };

    return promise.then(
      () => {
        reset();
        return true;
      },
      () => {
        reset();
        return false;
      }
    );
  };

  // Call cancel in a cleanup func to avoid dangling confirm dialog
  useEffect(() => {
    return () => {
      if (confirm && confirm.cancel && needsCleanup) {
        confirm.cancel();
      }
    };
  }, [confirm, needsCleanup]);

  return {
    ...confirm,
    isConfirmed,
  };
};

export default useConfirm;

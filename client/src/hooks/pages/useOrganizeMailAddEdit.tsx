import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import {
  storeOrganizeMail,
  updateOrganizeMail,
} from "@/services/OrganizeMailService";
import {
  OrganizeMailFormAttribute,
  OrganizeMailFormAttributeWithId,
  organizeMailFormInit,
  organizeMailFormSchema,
} from "@/validations/OrganizeMailFormValidation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form-mui";

interface OrganizeMailAddEditProps {
  state: "add" | OrganizeMailFormAttributeWithId | null;
  closeFn: () => void;
  resolverFn: () => void;
}

function useOrganizeMailAddEdit({
  state,
  resolverFn,
  closeFn,
}: OrganizeMailAddEditProps) {
  const mounted = useRef(true);
  const { isConfirmed } = useConfirm();
  const { successSnackbar, handleError } = useAlerter();

  const formContext = useForm<OrganizeMailFormAttribute>({
    mode: "onChange",
    defaultValues: organizeMailFormInit,
    resolver: yupResolver(organizeMailFormSchema),
  });

  const handleSubmit = formContext.handleSubmit(
    async (raw: OrganizeMailFormAttribute) => {
      const confirmed = await isConfirmed({
        title: "sure ka?",
        content: "text here",
      });

      if (confirmed) {
        try {
          const res = await (state === "add"
            ? storeOrganizeMail(raw)
            : updateOrganizeMail(state!.id, raw));

          successSnackbar(res.data.message);
          handleClose();
          resolverFn();
        } catch (e: any) {
          const errors = handleError(e);
          type Key = keyof OrganizeMailFormAttribute;
          Object.entries(errors).forEach(([name, error]) => {
            const err = error as string | string[];
            const str_error = typeof err === "string" ? err : err.join("");
            formContext.setError(name as Key, {
              type: "manual",
              message: str_error,
            });
          });
        }
      }
    },
    (a, b) => console.log({ a, b })
  );

  const handleClose = () => {
    closeFn();
    setTimeout(() => {
      formContext.reset(organizeMailFormInit);
    }, 200);
  };

  useEffect(() => {
    mounted.current = true;

    if (state && state !== "add") {
      formContext.reset(state);
    }

    return () => {
      mounted.current = false;
    };
  }, [state, formContext]);

  return { formContext, handleSubmit, handleClose };
}

export default useOrganizeMailAddEdit;

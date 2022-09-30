import { useForm } from "react-hook-form-mui";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import useAlerter from "@/hooks/useAlerter";
import useConfirm from "@/hooks/useConfirm";
import { yupResolver } from "@hookform/resolvers/yup";
import { getOptions } from "@/services/CommonService";
import {
  showNotice,
  storeNotice,
  updateNotice,
} from "@/services/NoticeService";
import {
  NoticeFormAttribute,
  noticeFormInit,
  noticeFormSchema,
} from "@/validations/NoticeFormValidation";

function useNoticeAddEdit() {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { state, pathname } = useLocation();
  const { noticeId } = useParams();
  const [initialized, setInitialized] = useState(false);
  const [signatures, setSignatures] = useState<OptionAttribute[]>([
    { id: 0, name: "未選択", selectionType: "disabled" },
  ]);
  const { successSnackbar, errorSnackbar, handleError } = useAlerter();
  const { isConfirmed } = useConfirm();
  const form = useForm<NoticeFormAttribute>({
    mode: "onChange",
    defaultValues: noticeFormInit,
    resolver: yupResolver(noticeFormSchema),
  });

  const isCreate =
    pathname
      .split("/")
      .filter((a) => a)
      .pop() === "create";

  const handleSubmit = form.handleSubmit(
    async (raw: NoticeFormAttribute) => {
      const confirmed = await isConfirmed({
        title: "confirm notice",
        content: "confirm notice",
      });

      if (confirmed) {
        try {
          const res = await (isCreate
            ? storeNotice(raw)
            : updateNotice(+noticeId!, raw));
          successSnackbar(res.data.message);
          navigate("/notice-management");
        } catch (e: any) {
          handleError(e, form);
        }
      }
    },
    (a, b) => console.log({ a, b, data: form.getValues() })
  );

  useEffect(() => {
    mounted.current = true;

    (async () => {
      try {
        const promise = [getOptions(["signatures"])];

        if (!isCreate) promise.push(showNotice(+noticeId!));
        const res = await Promise.all(promise);

        setSignatures([
          { id: 0, name: "未選択", selectionType: "disabled" },
          ...res[0].data.signatures,
        ]);

        if (!isCreate) form.reset(res[1].data.data);
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setInitialized(true);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [state, noticeId, isCreate]);

  return {
    initialized,
    signatures,
    handleSubmit,
    isCreate,
    form,
  };
}

export default useNoticeAddEdit;

import {
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { useState } from "react";
import useConfirm from "@/hooks/useConfirm";
import useAlerter from "@/hooks/useAlerter";
import { useMutation } from "@tanstack/react-query";
import { post } from "@/services/ApiService";
import { useNavigate } from "react-router-dom";

function InquiryAdd() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const { errorSnackbar, successSnackbar } = useAlerter();
  const sendMutation = useMutation(
    (content: string) => post("/api/inquiries", { content }),
    {
      onSuccess: (res: any) => {
        successSnackbar(res.data.message);
        navigate("/");
      },
      onError: (e: any) => errorSnackbar(e.message),
      onSettled: () => setSending(false),
    }
  );

  const { isConfirmed } = useConfirm();

  const handleSubmit = async () => {
    setSending(true);
    const confirmed = await isConfirmed(
      <>
        <DialogTitle sx={{ px: 0, pt: 0 }}>
          <Typography variant="sectiontitle1">お問い合わせ内容確認</Typography>
        </DialogTitle>
        <DialogContent>
          <TextField
            value={content}
            label="お問い合わせ内容"
            multiline
            rows={8}
            fullWidth
            disabled
            sx={{ mt: 2 }}
          />
        </DialogContent>
      </>,
      {
        maxWidth: "md",
        proceedLabel: "送信",
      }
    );

    if (confirmed) sendMutation.mutate(content);
    else setSending(false);
  };

  return (
    <Paper variant="outlined">
      <Stack spacing={3}>
        <Typography variant="sectiontitle2">お問い合わせ</Typography>
        <Typography variant="subtitle2" textAlign="center" fontStyle="italic">
          講座やシステムに関する疑問・ご質問は、こちらのフォームよりお問い合わせください。
        </Typography>
        <TextField
          label="お問い合わせ内容"
          multiline
          rows={8}
          placeholder="自由記入欄"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={sending}
        />
        <Button
          variant="contained"
          color="secondary"
          disabled={!content}
          sx={{
            maxWidth: 200,
            p: 2,
            borderRadius: 7,
            alignSelf: "center",
          }}
          onClick={handleSubmit}
          loading={sending}
        >
          送信
        </Button>
      </Stack>
    </Paper>
  );
}

export default InquiryAdd;

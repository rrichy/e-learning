import { jpDate } from "@/mixins/jpFormatter";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { showNotice } from "@/services/NoticeService";
import {
  NoticeFormAttribute,
  noticeFormInit,
} from "@/validations/NoticeFormValidation";
import {
  ArticleOutlined,
  Close,
  MarkunreadOutlined,
} from "@mui/icons-material";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

function NoticeDetails({
  id,
  onClose,
}: {
  id: number | null;
  onClose: () => void;
}) {
  const [initialized, setInitialized] = useState(false);
  const [notice, setNotice] = useState<NoticeFormAttribute>(noticeFormInit);

  const handleClose = () => {
    onClose();
    setInitialized(false);
    setTimeout(() => {
      setNotice(noticeFormInit);
    }, 200);
  };

  useEffect(() => {
    if (id) {
      (async () => {
        const res = await showNotice(id, true);
        setNotice(res.data.data);
        setInitialized(true);
      })();
    }
  }, [id]);

  return (
    <Dialog
      open={Boolean(id)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: "#f7f7f7", position: "relative" } }}
    >
      <IconButton
        onClick={handleClose}
        color="primary"
        size="large"
        disableRipple
        sx={{ position: "absolute", right: 0 }}
      >
        <Close fontSize="large" sx={{ color: "white" }} />
      </IconButton>
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">お知らせ</Typography>
      </DialogTitle>
      <DialogContent>
        <DisabledComponentContextProvider value={!initialized} showLoading>
          <Paper variant="subpaper">
            <Typography variant="sectiontitle2" gutterBottom>
              {notice.subject}
            </Typography>
            <Typography fontStyle="italic" mb={2}>
              {jpDate(notice.date_publish_start)}~
              {jpDate(notice.date_publish_end)}
            </Typography>
            <Typography fontStyle="italic" whiteSpace="pre-line" mb={2}>
              {notice.content}
            </Typography>
            <Typography mt={2} fontStyle="italic" gutterBottom>
              {notice.author}
            </Typography>
            <Typography fontStyle="italic">
              {jpDate(notice.created_at)}
            </Typography>
            <Box>
              {Boolean(notice.shown_in_mail) && (
                <Tooltip title="Mail sent">
                  <MarkunreadOutlined />
                </Tooltip>
              )}
              {Boolean(notice.shown_in_bulletin) && (
                <Tooltip title="Shown in bulletin">
                  <ArticleOutlined />
                </Tooltip>
              )}
            </Box>
          </Paper>
        </DisabledComponentContextProvider>
      </DialogContent>
    </Dialog>
  );
}

export default NoticeDetails;

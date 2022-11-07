import { jpDate } from "@/mixins/jpFormatter";
import DisabledComponentContextProvider from "@/providers/DisabledComponentContextProvider";
import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { InquiryRowAttribute } from "../pages/Inquiries";

const init: InquiryRowAttribute = {
  id: 0,
  content: "",
  name: "",
  email: "",
  created_at: "",
};

function InquiryDetails({
  propInquiry,
  onClose,
}: {
  propInquiry: InquiryRowAttribute | null;
  onClose: () => void;
}) {
  const [initialized, setInitialized] = useState(false);
  const [inquiry, setInquiry] = useState<InquiryRowAttribute>(init);

  const handleClose = () => {
    onClose();
    setInitialized(false);
    setTimeout(() => {
      setInquiry(init);
    }, 200);
  };

  useEffect(() => {
    if (propInquiry) {
      setInquiry(propInquiry);
      setInitialized(true);
    }
  }, [propInquiry]);

  return (
    <Dialog
      open={Boolean(propInquiry)}
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
        <Typography variant="sectiontitle1">お問い合わせ</Typography>
      </DialogTitle>
      <DialogContent>
        <DisabledComponentContextProvider value={!initialized} showLoading>
          <Paper variant="subpaper">
            <Typography fontStyle="italic" whiteSpace="pre-line" mb={2}>
              {inquiry.content}
            </Typography>
            <Typography mt={2} fontStyle="italic" fontWeight="bold" gutterBottom>
              {inquiry.name} ({inquiry.email})
            </Typography>
            <Typography fontStyle="italic">
              {jpDate(inquiry.created_at)}
            </Typography>
          </Paper>
        </DisabledComponentContextProvider>
      </DialogContent>
    </Dialog>
  );
}

export default InquiryDetails;

import { jpDate } from "@/mixins/jpFormatter";
import { get } from "@/services/ApiService";
import { Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Skeleton,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface InquiryDetailsAttribute {
  id: number;
  content: string;
  name: string;
  email: string;
  created_at: string;
}

interface InquiryDetailsProps {
  id: number | null;
  onClose: () => void;
}

function InquiryDetails({ id, onClose }: InquiryDetailsProps) {
  const [localId, setLocalId] = useState<number | null>(null);
  const { data, isFetching } = useQuery(
    ["inquiry", localId],
    async () => {
      const res = await get("/api/inquiry/" + localId);

      return res.data.data as InquiryDetailsAttribute;
    },
    {
      staleTime: 10_000,
      refetchOnWindowFocus: false,
      enabled: !!localId,
    }
  );

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setLocalId(null);
    }, 200);
  };

  useEffect(() => {
    if (id) setLocalId(id);
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
        <Typography variant="sectiontitle1">お問い合わせ</Typography>
      </DialogTitle>
      <DialogContent>
        {isFetching || !data ? (
          <Paper variant="subpaper">
            <Skeleton variant="rounded" height={300} sx={{ mb: 2 }} />
            <Skeleton variant="text" height={32} />
            <Skeleton variant="text" height={32} />
          </Paper>
        ) : (
          <Details data={data} />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default InquiryDetails;

const Details = ({ data }: { data: InquiryDetailsAttribute }) => (
  <Paper variant="subpaper">
    <Typography fontStyle="italic" whiteSpace="pre-line" mb={2}>
      {data.content}
    </Typography>
    <Typography mt={2} fontStyle="italic" fontWeight="bold" gutterBottom>
      {data.name} ({data.email})
    </Typography>
    <Typography fontStyle="italic">{jpDate(data.created_at)}</Typography>
  </Paper>
);

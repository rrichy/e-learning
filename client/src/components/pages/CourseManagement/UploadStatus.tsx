import Button from "@/components/atoms/Button";
import { ChapterAttributes } from "@/validations/CourseFormValidation";
import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";

interface UploadStatusProps {
  onClose: () => void;
  state: {
    progress: number[][];
    status: "uploading" | "complete";
    chapters: ChapterAttributes[];
  } | null;
}

function UploadStatus({ state: propState, onClose }: UploadStatusProps) {
  const [state, setState] = useState<{
    progress: number[][];
    status: "uploading" | "complete";
    chapters: ChapterAttributes[];
  } | null>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setState(null);
    }, 200);
  };

  useEffect(() => {
    if (propState) setState(propState);
  }, [propState]);

  return (
    <Dialog
      open={Boolean(propState)}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { bgcolor: "#f7f7f7" } }}
    >
      <DialogTitle sx={{ px: 0, pt: 0 }}>
        <Typography variant="sectiontitle1">アプロードステータス</Typography>
      </DialogTitle>
      <DialogContent>
        <Paper variant="subpaper">
          <Typography
            variant="sectiontitle2"
            sx={{ transform: "translate(-8px, -8px)" }}
          >
            基本情報
          </Typography>
          {state?.chapters.map(({ explainer_videos }, chapterIndex) =>
            explainer_videos?.map((_, index) => (
              <Grid
                container
                spacing={2}
                key={`chapter-${chapterIndex}-video-${index}`}
              >
                {/* <Grid item xs={3}>1-1 解説動画</Grid> */}
                <Grid item xs={3}>{`${chapterIndex + 1}-${
                  index + 1
                } 解説動画`}</Grid>
                <Grid item xs={9}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box sx={{ width: "100%", mr: 1 }}>
                      <LinearProgress
                        variant="determinate"
                        value={state?.progress[chapterIndex][index]}
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >{`${state?.progress[chapterIndex][index]}%`}</Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            ))
          )}
        </Paper>
        <Stack
          direction="row"
          mt={3}
          spacing={1}
          justifyContent="space-between"
          sx={{
            "& button": {
              height: 60,
              borderRadius: 8,
            },
          }}
        >
          <Button
            variant="outlined"
            color="dull"
            type="button"
            onClick={handleClose}
            // disabled={isSubmitting}
          >
            {state?.status === "complete" ? "閉じる" : "キャンセル"}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default UploadStatus;

import { QuestionAttributes } from "@/hooks/pages/Students/useChapter";
import { CircleOutlined, Close } from "@mui/icons-material";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Radio,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { MenuItem } from "@material-ui/core";

interface TestExplanationProps {
  question: QuestionAttributes | null;
  onClose: () => void;
}

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function TestExplanation({ question, onClose }: TestExplanationProps) {
  const [state, setState] = useState<QuestionAttributes | null>(null);

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setState(null);
    }, 200);
  };

  useEffect(() => {
    if (!state && question) setState(question);
  }, [question, state]);

  return (
    <Dialog
      open={Boolean(question)}
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
        <Typography variant="sectiontitle1">
          {state?.item_number} {state?.title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Paper variant="subpaper" sx={{ p: "16px !important" }}>
          <Typography
            sx={{
              borderLeft: "5px solid #00b4aa",
              paddingLeft: 1,
              mb: 2,
            }}
          >
            {state?.statement}
          </Typography>

          {state?.format === 1 && (
            <Stack sx={{ "& *": { m: "0 !important" } }}>
              {state?.options.map((o, index) => (
                <FormControlLabel
                  key={o.id + "" + index}
                  control={
                    <Radio
                      checked={
                        state?.user_answer[0].answer!.toLowerCase() ===
                        o.description.trim().toLowerCase()
                      }
                      disableRipple
                    />
                  }
                  label={o.description}
                />
              ))}
            </Stack>
          )}

          {state?.format === 2 && (
            <Stack spacing={1}>
              {state?.user_answer.map((a, index) => (
                <Stack
                  direction="row"
                  spacing={2}
                  width={1}
                  flex={1}
                  alignItems="center"
                  key={"selection-" + index}
                >
                  <Typography width={50} fontWeight="bold" textAlign="right">
                    {ALPHA[index]}:
                  </Typography>
                  <TextField
                    value={a.answer}
                    select
                    size="small"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  >
                    <MenuItem value={a.answer!}>{a.answer}</MenuItem>
                  </TextField>
                </Stack>
              ))}
            </Stack>
          )}

          {state?.format === 3 && (
            <Stack spacing={1}>
              {state?.user_answer.map((a, index) => (
                <Stack
                  direction="row"
                  spacing={2}
                  width={1}
                  flex={1}
                  alignItems="center"
                  key={"textfield-" + index}
                >
                  <Typography width={50} fontWeight="bold" textAlign="right">
                    {ALPHA[index]}:
                  </Typography>
                  <TextField
                    value={a.answer}
                    size="small"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Stack>
              ))}
            </Stack>
          )}

          <FormControlLabel
            label={<Typography fontWeight="bold">正解</Typography>}
            control={<CircleOutlined sx={{ color: "red" }} />}
            sx={{ pl: 2, cursor: "default", mt: 3, mb: 2 }}
          />
          {state?.options
            .filter((a) => Boolean(a.correction_order))
            .sort(
              (a, b) => (a.correction_order ?? 0) - (b.correction_order ?? 0)
            )
            .map((a, index) => (
              <Stack
                direction="row"
                spacing={2}
                width={1}
                flex={1}
                alignItems="center"
                key={"answers-" + index}
              >
                <Typography width={50} fontWeight="bold" textAlign="right">
                  {ALPHA[index]}:
                </Typography>
                <Typography>{a.description}</Typography>
              </Stack>
            ))}

          <Typography variant="sectiontitle2" mt={3} mb={2}>
            解説
          </Typography>
          <Typography variant="subtitle2">{state?.explanation}</Typography>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

export default TestExplanation;

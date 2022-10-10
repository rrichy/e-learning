import { QuestionAttributes } from "@/hooks/pages/Students/useChapter";
import Button from "@/components/atoms/Button";
import {
  CircleOutlined,
  Close,
  CloseOutlined,
  Delete,
} from "@mui/icons-material";
import {
  Box,
  Checkbox,
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
import React, { useEffect, useRef, useState } from "react";
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

          <Stack spacing={1}>
            {state?.format === 1 &&
              state?.options.map((o, index) => (
                <FormControlLabel
                  key={o.id + "" + index}
                  control={
                    <Radio
                      checked={Boolean(o.correction_order)}
                      disableRipple
                      disableFocusRipple
                    />
                  }
                  label={o.description}
                />
              ))}

            {state?.format === 2 &&
              state?.options
                .sort(
                  (a, b) =>
                    (a.correction_order ?? 0) - (b.correction_order ?? 0)
                )
                .map((a, index) =>
                  !a.correction_order ? null : (
                    <Stack
                      direction="row"
                      spacing={2}
                      width={1}
                      flex={1}
                      alignItems="center"
                      key={a.id + "" + index}
                    >
                      <Typography
                        width={50}
                        fontWeight="bold"
                        textAlign="right"
                      >
                        {ALPHA[index]}:
                      </Typography>
                      <TextField
                        value={a.description}
                        select
                        size="small"
                        fullWidth
                        InputProps={{
                          readOnly: true,
                        }}
                      >
                        <MenuItem value={a.description}>
                          {a.description}
                        </MenuItem>
                      </TextField>
                    </Stack>
                  )
                )}

            {state?.format === 3 &&
              state?.options.map((a, index) => (
                <Stack
                  direction="row"
                  spacing={2}
                  width={1}
                  flex={1}
                  alignItems="center"
                  key={a.id + "" + index}
                >
                  <Typography width={50} fontWeight="bold" textAlign="right">
                    {ALPHA[index]}:
                  </Typography>
                  <TextField
                    value={a.description}
                    size="small"
                    fullWidth
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Stack>
              ))}
          </Stack>

          <FormControlLabel
            label={<Typography fontWeight="bold" mt={3} mb={2}>正解</Typography>}
            control={<CircleOutlined sx={{ color: "red" }} />}
            sx={{ pl: 2, cursor: "default" }}
          />
          {state?.options
            .sort(
              (a, b) => (a.correction_order ?? 0) - (b.correction_order ?? 0)
            )
            .map((a) =>
              !a.correction_order ? null : (
                <Typography ml={3}>{a.description}</Typography>
              )
            )}

          <Typography variant="sectiontitle2" mt={3} mb={2}>解説</Typography>
          <Typography variant="subtitle2">{state?.explaination}</Typography>
        </Paper>
      </DialogContent>
    </Dialog>
  );
}

export default TestExplanation;

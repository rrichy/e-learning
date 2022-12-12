import useChapter, {
  QuestionAttributes,
} from "@/hooks/pages/Students/useChapter";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { CircleOutlined, CloseOutlined } from "@mui/icons-material";
import {
  Grid,
  Stack,
  Paper,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import { initTableState, TableStateProps } from "@/interfaces/CommonInterface";
import useAlerter from "@/hooks/useAlerter";
import TestExplanation from "./TestExplanation";
import MyTable from "@/components/atoms/MyTable";
import { resultColumns } from "@/columns";

function TestResult({ preview }: { preview?: boolean }) {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { hasSubmitted, prefix, result } = useChapter(preview);
  const [initialized, setInitialized] = useState(false);
  const { errorSnackbar } = useAlerter();
  const [state, setState] =
    useState<TableStateProps<QuestionAttributes>>(initTableState);
  const [stateSelected, setStateSelected] = useState<QuestionAttributes | null>(
    null
  );

  if (!hasSubmitted) navigate(prefix!);

  const columns = resultColumns(setStateSelected);

  useEffect(() => {
    mounted.current = true;

    if (!initialized) {
      setState((s) => ({ ...s, data: result!.questions }));
      setInitialized(true);
    }

    return () => {
      mounted.current = false;
    };
  }, [errorSnackbar, result, initialized]);

  return (
    <>
      <Grid item xs={12}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            受験結果
          </Typography>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            my={3}
            color={result!.passed ? "red" : "primary.main"}
          >
            {result!.passed ? "合格" : "不合格"}
          </Typography>
          <Typography
            fontWeight="bold"
            textAlign="center"
            m={2}
            sx={{ "& strong": { fontSize: 28, color: "red", mx: 1 } }}
          >
            あなたの得点は<strong>{result!.score}点</strong>です（
            {result!.total}
            満点中）
          </Typography>
        </Paper>
      </Grid>
      <Grid item xs={12}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            答え合わせ
          </Typography>
          <Stack spacing={2} width={1} p={{ xs: 2, md: 4 }}>
            <Stack
              ml={2}
              direction="row"
              sx={{ "& label": { cursor: "default" } }}
            >
              <FormControlLabel
                label="：正解"
                control={<CircleOutlined sx={{ color: "red" }} />}
              />
              <FormControlLabel
                label="：不正解"
                control={<CloseOutlined color="primary" />}
              />
            </Stack>
            <MyTable columns={columns} state={state} />
          </Stack>
        </Paper>
      </Grid>
      <TestExplanation
        question={stateSelected}
        onClose={() => setStateSelected(null)}
      />
    </>
  );
}

export default TestResult;

import useChapter, {
  QuestionAttributes,
} from "@/hooks/pages/Students/useChapter";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import { CircleOutlined, CloseOutlined } from "@mui/icons-material";
import {
  Grid,
  Stack,
  Paper,
  Typography,
  FormControlLabel,
} from "@mui/material";
import { useEffect, useState } from "react";
import Table from "@/components/atoms/Table";
import { Column } from "material-table";
import { initPaginatedData, OrderType } from "@/interfaces/CommonInterface";
import useAlerter from "@/hooks/useAlerter";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import TestExplanation from "./TestExplanation";

function TestResult({ preview }: { preview?: boolean }) {
  const mounted = useRef(true);
  const navigate = useNavigate();
  const { hasSubmitted, prefix, result } = useChapter(preview);
  const [initialized, setInitialized] = useState(false);
  const { errorSnackbar } = useAlerter();
  const [state, setState] = useState(initPaginatedData<QuestionAttributes>());
  const [stateSelected, setStateSelected] = useState<QuestionAttributes | null>(
    null
  );

  if (!hasSubmitted) navigate(prefix);

  const columns: Column<QuestionAttributes>[] = [
    { field: "item_number", title: "設問番号" },
    {
      field: "answered_correctly",
      title: "解答結果",
      render: (row) =>
        row.answered_correctly ? (
          <CircleOutlined sx={{ color: "red" }} />
        ) : (
          <CloseOutlined color="primary" />
        ),
    },
    { field: "score", title: "配点" },
    { field: "statement", title: "設問文題" },
  ];

  useEffect(() => {
    mounted.current = true;

    if (!initialized) {
      setState((s) => ({ ...s, data: result.questions, loading: false }));
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
            color={result.passed ? "red" : "primary.main"}
          >
            {result.passed ? "合格" : "不合格"}
          </Typography>
          <Typography
            fontWeight="bold"
            textAlign="center"
            m={2}
            sx={{ "& strong": { fontSize: 28, color: "red", mx: 1 } }}
          >
            あなたの得点は<strong>{result.score}点</strong>です（{result.total}
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
            <Table
              columns={columns}
              state={state}
              actions={[
                (row) => ({
                  icon: "save",
                  onClick: () => null,
                }),
              ]}
              localization={{
                header: {
                  actions: "詳細表示",
                },
              }}
              options={{
                actionsColumnIndex: -1,
                paging: false,
                sorting: false,
              }}
              components={{
                Action: (props) => (
                  <Button
                    variant="contained"
                    onClick={(event) => setStateSelected(props.data)}
                  >
                    詳細
                  </Button>
                ),
              }}
            />
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

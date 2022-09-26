import { Box, Link, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import useAlerter from "@/hooks/useAlerter";
import {
  initPaginatedData,
  OptionAttribute,
  OrderType,
  PageDialogProps,
} from "@/interfaces/CommonInterface";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { Column } from "material-table";
import { OrganizeMailFormAttributeWithId } from "@/validations/OrganizeMailFormValidation";
import {
  destroyOrganizeMail,
  indexOrganizeMail,
} from "@/services/OrganizeMailService";
import Table from "@/components/atoms/Table";
import { getOptions } from "@/services/CommonService";
import OrganizeMailAddEdit from "./OrganizeMailAddEdit";

function OrganizeMail() {
  const mounted = useRef(true);
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [state, setState] = useState(
    initPaginatedData<OrganizeMailFormAttributeWithId>()
  );
  const [stateSelected, setStateSelected] = useState<
    OrganizeMailFormAttributeWithId[]
  >([]);
  const [signatures, setSignatures] = useState({
    lookup: {} as { [k: number]: string },
    option: [
      { id: 0, name: "未選択", selectionType: "disabled" },
    ] as OptionAttribute[],
  });
  const [dialog, setDialog] =
    useState<PageDialogProps<OrganizeMailFormAttributeWithId>>(null);

  const fetchData = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof OrganizeMailFormAttributeWithId = "priority",
      order: OrderType = "asc"
    ) => {
      try {
        setState((s) => ({
          ...s,
          page,
          order,
          sort,
          per_page: pageSize,
          loading: true,
        }));

        const res = await indexOrganizeMail(page, pageSize, sort, order);
        const { data, meta } = res.data;
        if (mounted.current)
          setState((s) => ({
            ...s,
            loading: false,
            data,
            page: meta.current_page,
            total: meta.total,
            order,
            sort,
            per_page: meta.per_page,
            last_page: meta.last_page,
          }));
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    },
    []
  );

  const handleDelete = async () => {
    try {
      setState((s) => ({ ...s, loading: true }));
      const res = await destroyOrganizeMail(stateSelected.map((a) => a.id));
      successSnackbar(res.data.message);
      fetchData();
    } catch (e: any) {
      errorSnackbar(e.message);
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const columns: Column<OrganizeMailFormAttributeWithId>[] = [
    {
      field: "title",
      title: "タイトル",
      render: (row) => (
        <Link component="button" onClick={() => setDialog(row)}>
          {row.title}
        </Link>
      ),
    },
    { field: "content", title: "内容" },
    { field: "priority", title: "並び順" },
    { field: "signature_id", title: "署名", lookup: signatures.lookup },
  ];

  useEffect(() => {
    mounted.current = true;
    fetchData();

    (async () => {
      try {
        const res = await getOptions(["signatures"]);
        setSignatures({
          lookup: res.data.signatures.reduce(
            (acc: any, b: any) => ({ ...acc, [b.id]: b.name }),
            {} as any
          ),
          option: [
            { id: 0, name: "未選択", selectionType: "disabled" },
            ...res.data.signatures,
          ],
        });
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [errorSnackbar]);

  return (
    <Stack justifyContent="space-between">
      <Paper variant="outlined">
        <Stack spacing={3}>
          <Typography variant="sectiontitle2">
            メールテンプレートの管理
          </Typography>
          <Stack
            spacing={1}
            direction="row"
            sx={{
              "& button": {
                borderRadius: 6,
                maxWidth: "fit-content",
                wordBreak: "keep-all",
              },
            }}
          >
            <Button
              variant="contained"
              color="secondary"
              onClick={handleDelete}
              disabled={stateSelected.length === 0}
            >
              削除
            </Button>
            <Button variant="contained" onClick={() => setDialog("add")}>
              新規追加
            </Button>
            <Box flex={1} />
            <Button
              variant="outlined"
              color="dull"
              sx={{ width: 75, borderRadius: 6 }}
            >
              戻す restore default order
            </Button>
            <Button variant="contained" sx={{ width: 75, borderRadius: 6 }}>
              更新 change order
            </Button>
          </Stack>
          <Table
            columns={columns}
            state={state}
            fetchData={fetchData}
            onSelectionChange={(rows) => setStateSelected(rows)}
            options={{
              selection: true,
            }}
          />
        </Stack>
        <OrganizeMailAddEdit
          state={dialog}
          closeFn={() => setDialog(null)}
          resolverFn={() =>
            fetchData(state.page, state.per_page, state.sort, state.order)
          }
          signatures={signatures.option}
        />
      </Paper>
    </Stack>
  );

  // return (
  //   <Stack justifyContent="space-between">
  //     <Container>
  //       <Stack spacing={3} sx={{ p: 3 }}>
  //         <Paper variant="softoutline" sx={{ p: 6 }}>
  //           <Stack spacing={3}>
  //             <Typography
  //               fontWeight="bold"
  //               variant="h6"
  //               pl={1}
  //               sx={{ borderLeft: "5px solid #00c2b2" }}
  //             >
  //               メールテンプレートの管理
  //             </Typography>
  //             <Stack spacing={2} direction="row" justifyContent="space-between">
  //               <Stack spacing={1} direction="row">
  //                 <Button
  //                   variant="contained"
  //                   color="warning"
  //                   sx={{ width: 75, borderRadius: 6 }}
  //                 >
  //                   削除
  //                 </Button>
  //                 <Button
  //                   variant="contained"
  //                   sx={{ width: 100, borderRadius: 6 }}
  //                   onClick={handleClickOpen}
  //                 >
  //                   新規追加
  //                 </Button>
  //               </Stack>
  //               <Stack spacing={1} direction="row">
  //                 <Button
  //                   variant="contained"
  //                   color="info"
  //                   sx={{ width: 75, borderRadius: 6 }}
  //                 >
  //                   戻す
  //                 </Button>
  //                 <Button
  //                   variant="contained"
  //                   sx={{ width: 75, borderRadius: 6 }}
  //                 >
  //                   更新
  //                 </Button>
  //               </Stack>
  //             </Stack>
  //             <Typography>Table Here</Typography>
  //           </Stack>
  //         </Paper>
  //       </Stack>
  //       <FormContainer>
  //         <Dialog open={open} maxWidth="lg">
  //           <DialogTitle>
  //             <Typography
  //               fontWeight="bold"
  //               variant="h6"
  //               pl={1}
  //               sx={{ borderLeft: '5px solid #00c2b2' }}
  //             >
  //               メールテンプレートの編集
  //             </Typography>
  //             <IconButton
  //               onClick={handleClose}
  //               sx={{
  //                 position: 'absolute',
  //                 right: 8,
  //                 top: 8,
  //                 color: (theme) => theme.palette.grey[500],
  //               }}
  //             >
  //               <CloseIcon />
  //             </IconButton>
  //           </DialogTitle>
  //           <DialogContent>
  //             <Card>
  //               <CardHeader
  //                 title="基本情報"
  //                 sx={{
  //                   fontWeight: "bold",
  //                   background: "#000000",
  //                   color: "#ffffff",
  //                   fontSize: "1.25rem"
  //                 }}
  //               />
  //               <CardContent>
  //                 <Stack spacing={2} p={2}>
  //                   <TextField
  //                     name="name"
  //                     label="タイトル"
  //                     placeholder="タイトルを入力"
  //                   />
  //                   <TextField
  //                     name="name"
  //                     label="内容"
  //                     placeholder="内容を入力"
  //                     multiline
  //                     rows={3}
  //                   />
  //                   <Selection
  //                     name="sex"
  //                     label="署名選択"
  //                   />
  //                 </Stack>
  //               </CardContent>
  //             </Card>
  //             <Stack direction="row" spacing={1} justifyContent="center" pt={2}>
  //               <Button large color="inherit" variant="outlined" sx={{ borderRadius: 7 }}>キャンセル</Button>
  //               <Button large color="warning" variant="contained" sx={{ borderRadius: 7 }}>登録</Button>
  //             </Stack>
  //           </DialogContent>
  //         </Dialog>
  //       </FormContainer>
  //     </Container>
  //   </Stack>
  // );
}

export default OrganizeMail;

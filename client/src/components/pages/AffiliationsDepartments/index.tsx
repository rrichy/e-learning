import { Link, Paper, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import Button from "@/components/atoms/Button";
import { GridSelectionModel } from "@mui/x-data-grid";
import { useCallback, useEffect, useRef, useState } from "react";
import AffiliationAddEdit from "./AffiliationAddEdit";
import {
  destroyAffiliation,
  indexAffiliation,
} from "@/services/AffiliationService";
import { AffiliationFormAttributeWithId } from "@/validations/AffiliationFormValidation";
import useAlerter from "@/hooks/useAlerter";
import {
  initPaginatedData,
  OptionsAttribute,
  OrderType,
  PageDialogProps,
} from "@/interfaces/CommonInterface";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { DepartmentFormAttributeWithId } from "@/validations/DepartmentFormValidation";
import {
  destroyDepartment,
  indexDepartment,
} from "@/services/DepartmentService";
import DepartmentAddEdit from "./DepartmentAddEdit";
import { getOptions } from "@/services/CommonService";
import OptionsContextProvider from "@/providers/OptionsContextProvider";
import Table from "@/components/atoms/Table";
import { Column } from "material-table";
import useAuth from "@/hooks/useAuth";
import { MembershipType } from "@/enums/membershipTypes";

function AffiliationsDepartments() {
  const mounted = useRef(true);
  const { membershipTypeId } = useAuth();
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [options, setOptions] = useState<OptionsAttribute>({});
  const [affiliationsState, setAffiliationsState] = useState(
    initPaginatedData<AffiliationFormAttributeWithId>()
  );
  const [affiliationSelected, setAffiliationSelected] = useState<
    AffiliationFormAttributeWithId[]
  >([]);
  const [affiliationDialog, setAffiliationDialog] =
    useState<PageDialogProps<AffiliationFormAttributeWithId>>(null);
  const [departmentsState, setDepartmentsState] = useState(
    initPaginatedData<DepartmentFormAttributeWithId>()
  );
  const [departmentSelected, setDepartmentSelected] = useState<
    DepartmentFormAttributeWithId[]
  >([]);
  const [departmentDialog, setDepartmentDialog] =
    useState<PageDialogProps<DepartmentFormAttributeWithId>>(null);

  const fetchAffiliations = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof AffiliationFormAttributeWithId = "id",
      order: OrderType = "desc"
    ) => {
      try {
        setAffiliationsState((s) => ({
          ...s,
          page,
          order,
          sort,
          per_page: pageSize,
          loading: true,
        }));

        const res = await Promise.all([
          indexAffiliation(page, pageSize, sort, order),
          getOptions(["affiliations"]),
        ]);

        const { data, meta } = res[0].data;
        if (mounted.current) {
          setAffiliationsState((s) => ({
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
          setOptions({
            affiliation_id: [
              { id: 0, name: "未選択" },
              ...res[1].data.affiliations,
            ],
          });
        }
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    },
    []
  );

  const fetchDepartments = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof DepartmentFormAttributeWithId = "id",
      order: OrderType = "desc"
    ) => {
      try {
        setDepartmentsState((s) => ({
          ...s,
          page,
          order,
          sort,
          per_page: pageSize,
          loading: true,
        }));

        const res = await indexDepartment(page, pageSize, sort, order);
        const { data, meta } = res.data;
        if (mounted.current)
          setDepartmentsState((s) => ({
            ...s,
            loading: false,
            data: data.reduce(
              (acc: any, parent: any) =>
                acc.concat(parent, ...parent.child_departments),
              []
            ),
            page: meta.current_page,
            total: meta.total,
            order,
            sort,
            per_page: meta.per_page,
            last_page: meta.last_page,
          }));
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    },
    []
  );

  const handleDelete = async (model: "affiliation" | "department") => {
    try {
      if (model === "affiliation") {
        const res = await destroyAffiliation(
          affiliationSelected.map((a) => a.id)
        );
        successSnackbar(res.data.message);
        fetchAffiliations();
      } else {
        const res = await destroyDepartment(
          departmentSelected.map((a) => a.id)
        );
        successSnackbar(res.data.message);
        fetchDepartments();
      }
    } catch (e: any) {
      errorSnackbar(e.message);
    }
  };

  const affiliationsColumns: Column<AffiliationFormAttributeWithId>[] = [
    {
      field: "name",
      title: "所属",
      render: (row) => (
        <Link component="button" onClick={() => setAffiliationDialog(row)}>
          {row.name}
        </Link>
      ),
    },
    { field: "priority", title: "並び順" },
  ];

  const departmentsColumns: Column<DepartmentFormAttributeWithId>[] = [
    {
      field: "name",
      title: "所属",
      render: (row) => (
        <Link component="button" onClick={() => 
          setDepartmentDialog(
            row.parent_id
              ? departmentsState.data.find((a) => a.id === row.parent_id)!
              : row
          )}>
          {row.name}
        </Link>
      ),
    },
    { field: "priority", title: "並び順" },
  ];

  useEffect(() => {
    mounted.current = true;
    fetchAffiliations();
    fetchDepartments();

    return () => {
      mounted.current = false;
    };
  }, [membershipTypeId]);

  return (
    <Stack spacing={3}>
      {membershipTypeId === MembershipType.admin && (
        <>
          <Paper variant="outlined">
            <Stack spacing={3}>
              <Typography variant="sectiontitle2">所属の管理</Typography>
              <Stack spacing={1} direction="row">
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: "fit-content", borderRadius: 6 }}
                  onClick={() => handleDelete("affiliation")}
                  disabled={affiliationSelected.length === 0}
                >
                  削除
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: "fit-content", borderRadius: 6 }}
                  onClick={() => setAffiliationDialog("add")}
                >
                  追加
                </Button>
              </Stack>
              <Table
                columns={affiliationsColumns}
                state={affiliationsState}
                fetchData={fetchAffiliations}
                onSelectionChange={(rows) => setAffiliationSelected(rows)}
                options={{
                  selection: true,
                }}
              />
            </Stack>
          </Paper>
          <AffiliationAddEdit
            state={affiliationDialog}
            closeFn={() => setAffiliationDialog(null)}
            resolverFn={() =>
              fetchAffiliations(
                affiliationsState.page,
                affiliationsState.per_page,
                affiliationsState.sort,
                affiliationsState.order
              )
            }
          />
        </>
      )}
      {membershipTypeId >= MembershipType.corporate && (
        <>
          <Paper variant="outlined">
            <Stack spacing={3}>
              <Typography variant="sectiontitle2">部署の管理</Typography>
              <Stack spacing={1} direction="row">
                <Button
                  variant="contained"
                  color="secondary"
                  sx={{ width: "fit-content", borderRadius: 6 }}
                  onClick={() => handleDelete("department")}
                  disabled={departmentSelected.length === 0}
                >
                  削除
                </Button>
                <Button
                  variant="contained"
                  sx={{ width: "fit-content", borderRadius: 6 }}
                  onClick={() => setDepartmentDialog("add")}
                >
                  追加
                </Button>
              </Stack>
              <Table
                columns={departmentsColumns}
                state={departmentsState}
                fetchData={fetchDepartments}
                onSelectionChange={(rows) => setDepartmentSelected(rows)}
                parentChildData={(row, rows) =>
                  rows.find((a) => a.id === row.parent_id)
                }
                options={{
                  selection: true,
                }}
              />
            </Stack>
          </Paper>
          <OptionsContextProvider options={options}>
            <DepartmentAddEdit
              state={departmentDialog}
              closeFn={() => setDepartmentDialog(null)}
              resolverFn={() =>
                fetchDepartments(
                  departmentsState.page,
                  departmentsState.per_page,
                  departmentsState.sort,
                  departmentsState.order
                )
              }
            />
          </OptionsContextProvider>
        </>
      )}
    </Stack>
  );
}

export default AffiliationsDepartments;

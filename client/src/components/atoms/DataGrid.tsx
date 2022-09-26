import { OrderType, PaginatedData } from "@/interfaces/CommonInterface";
import {
  TABLE_IS_EMPTY_LABEL,
  TABLE_ROWS_PER_PAGE,
} from "@/settings/appconfig";
import {
  DataGrid as MuiDataGrid,
  DataGridProps as MuiDataGridProps,
} from "@mui/x-data-grid";
import { Inventory } from "@mui/icons-material";
import { Stack, Typography } from "@mui/material";

interface DataGridProps extends Omit<MuiDataGridProps, "rows"> {
  state: PaginatedData<any>;
  fetchData: (
    page?: number,
    pageSize?: number,
    sort?: any,
    order?: OrderType
  ) => void;
}

function DataGrid({ state, fetchData, ...props }: DataGridProps) {
  return (
    <div style={{ display: "flex", minHeight: 360, maxHeight: 520 }}>
      <div style={{ flexGrow: 1 }}>
        <MuiDataGrid
          rowsPerPageOptions={TABLE_ROWS_PER_PAGE}
          rows={state.data}
          paginationMode="server"
          sortingMode="server"
          onSortModelChange={([column]) =>
            fetchData(
              undefined,
              undefined,
              column?.field,
              column?.sort || undefined
            )
          }
          pageSize={state.per_page}
          onPageSizeChange={(per_page) =>
            fetchData(state.page, per_page, state.sort, state.order)
          }
          page={state.page - 1}
          onPageChange={(page) =>
            fetchData(page + 1, state.per_page, state.sort, state.order)
          }
          rowCount={state.total}
          loading={state.loading}
          components={{
            NoRowsOverlay: CustomNoRowsOverlay,
          }}
          {...props}
        />
      </div>
    </div>
  );
}

export default DataGrid;

const CustomNoRowsOverlay = () => (
  <Stack width={1} height={1} alignItems="center" justifyContent="center">
    <Inventory sx={{ width: 120, height: 100 }} />
    <Typography>{TABLE_IS_EMPTY_LABEL}</Typography>
  </Stack>
);

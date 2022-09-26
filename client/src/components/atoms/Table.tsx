import { OrderType, PaginatedData } from "@/interfaces/CommonInterface";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { Paper } from "@mui/material";
import MaterialTable, {
  MaterialTableProps,
  MTableHeader,
} from "material-table";

interface TableProps extends Omit<MaterialTableProps<any>, "data"> {
  state: PaginatedData<any>;
  fetchData: (
    page?: number,
    pageSize?: number,
    sort?: any,
    order?: OrderType
  ) => void;
}

function Table({ state, fetchData, columns, options, components, ...props }: TableProps) {
  return (
    <MaterialTable
      columns={columns}
      data={state.data}
      components={{
        Header: (props) => (
          <MTableHeader
            {...props}
            orderBy={columns.findIndex((a) => a.field === state.sort)}
            orderDirection={state.order}
            onOrderChange={(sortIndex: any, order: any) => {
              fetchData(
                state.page,
                state.per_page,
                order ? columns[sortIndex].field : "id",
                order || "desc"
              );
            }}
          />
        ),
        Container: (props) => <Paper {...props} variant="table" />,
        ...components,
      }}
      options={{
        toolbar: false,
        draggable: false,
        pageSizeOptions: TABLE_ROWS_PER_PAGE,
        pageSize: state.per_page,
        minBodyHeight: 300,
        maxBodyHeight: 600,
        ...options,
      }}
      onChangePage={(page, per_page) =>
        fetchData(page + 1, per_page, state.sort, state.order)
      }
      isLoading={state.loading}
      totalCount={state.total}
      page={state.page - 1}
      {...props}
    />
  );
}

export default Table;

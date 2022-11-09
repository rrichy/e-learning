import { initTableState, TableStateProps } from "@/interfaces/CommonInterface";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import {
  Box,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import emptyTable from "@/assets/empty_table.svg";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  RowSelectionState,
  useReactTable,
} from "@tanstack/react-table";
import Loading from "../molecules/Loading";

interface MyTableProps<T> {
  state?: TableStateProps<T>;
  columns: ColumnDef<T, string>[];
  loading?: boolean;
  selector?: {
    selected: RowSelectionState;
    setSelected: OnChangeFn<RowSelectionState>;
  };
}

function MyTable<T extends unknown>({
  state = initTableState,
  columns,
  loading,
  selector,
}: MyTableProps<T>) {
  const table = useReactTable({
    data: state.data,
    columns: selector ? appendSelectColumn(columns) : columns,
    pageCount: state.meta.last_page,
    state: {
      pagination: {
        pageIndex: state.meta.current_page - 1,
        pageSize: state.meta.per_page,
      },
      sorting: [
        { id: state.meta.sort ?? "id", desc: state.meta.order === "desc" },
      ],
      rowSelection: selector?.selected,
    },
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: state.paginator,
    onSortingChange: state.sorter,
    onRowSelectionChange: selector?.setSelected,
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <Box width={1} position="relative">
      <TableContainer
        sx={{
          width: 1,
          overflowX: "auto",
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
          // borderRight: "1px solid #e6e6e6",
          // borderLeft: "1px solid #e6e6e6",
          // "& table, & td": { border: "1px solid red"},
          "& tbody tr": {
            "&:nth-of-type(odd)": {
              bgcolor: "#00000005",
            },
            "&:hover": {
              bgcolor: "#0000000a",
            },
          },
        }}
      >
        <Table sx={{ width: 1, tableLayout: "fixed", minHeight: 300 }}>
          <TableHead
            sx={{
              "& th, & th .MuiTableSortLabel-root, & th .Mui-active .MuiTableSortLabel-icon, & th .MuiCheckbox-root:not(.Mui-checked, .MuiCheckbox-indeterminate)":
                {
                  bgcolor: "common.black",
                  color: "common.white",
                  fontWeight: "bold",
                },
            }}
            //  & th .MuiButtonBase-root,
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  // console.log({
                  //   "active-direction": header.column.getIsSorted(),
                  //   cansort: header.column.getCanSort(),
                  //   context: header.getContext(),
                  // });
                  return (
                    <TableCell
                      key={header.id}
                      sx={{ width: header.getSize(), textAlign: "center" }}
                      sortDirection={header.column.getIsSorted() || undefined}
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <TableSortLabel
                          active={header.column.getIsSorted() !== false}
                          direction={header.column.getIsSorted() || undefined}
                          onClick={(e) => {
                            table.setPageIndex(0);
                            const sorter =
                              header.column.getToggleSortingHandler();
                            if (sorter) sorter(e);
                          }}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableSortLabel>
                      ) : (
                        flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={table.getAllColumns().length}>
                  <Box
                    pt={2}
                    width={1}
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={2}
                  >
                    <img src={emptyTable} alt="" width={170} />
                    <Typography>No data</Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={state.meta.total}
        page={table.getState().pagination.pageIndex}
        rowsPerPage={table.getState().pagination.pageSize}
        rowsPerPageOptions={TABLE_ROWS_PER_PAGE}
        onPageChange={(_e, page) => {
          table.setPageIndex(page);
          table.resetRowSelection();
        }}
        onRowsPerPageChange={(e) => {
          table.setPageSize(+e.target.value);
          table.resetRowSelection();
        }}
      />
      <Loading loading={loading} />
    </Box>
  );
}

export default MyTable;

function appendSelectColumn<T extends unknown>(c: ColumnDef<T, string>[]) {
  return [
    {
      id: "id",
      header: ({ table }: any) => (
        <Checkbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler(),
          }}
          size="small"
        />
      ),
      cell: ({ row }: any) => (
        <Checkbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
          size="small"
        />
      ),
      enableSorting: false,
      size: 70,
      maxSize: 70,
      minSize: 70,
    },
    ...c,
  ];
}

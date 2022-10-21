import {
  OrderType,
  PaginatedData,
  ReactQueryPaginationInterface,
} from "@/interfaces/CommonInterface";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { Box, Paper } from "@mui/material";
import MaterialTable, {
  MaterialTableProps,
  MTableHeader,
} from "material-table";
import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import emptyTable from "@/assets/empty_table.svg";
import MTableBody from "./MTableBody";
import MTableBodyRow from "./MTableBodyRow";
import { Typography } from "@material-ui/core";

interface TableProps extends Omit<MaterialTableProps<any>, "data"> {
  state: PaginatedData<any> | ReactQueryPaginationInterface<any>;
  onDragEnd?: (result: DropResult) => void;
  fetchData?: (
    page?: number,
    pageSize?: number,
    sort?: any,
    order?: OrderType
  ) => void;
}

function Table({
  state,
  fetchData,
  columns,
  options,
  components,
  onDragEnd,
  localization,
  ...props
}: TableProps) {
  if ("meta" in state) {
    const paginatedState =
      state as unknown as ReactQueryPaginationInterface<any>;
    return (
      <MaterialTable
        columns={columns}
        data={paginatedState.data}
        components={{
          Header: (props) => (
            <MTableHeader
              {...props}
              orderBy={columns.findIndex(
                (a) => a.field === paginatedState.meta.sort
              )}
              orderDirection={paginatedState.meta.order}
              onOrderChange={(sortIndex: any, order: any) => {
                if (fetchData) {
                  fetchData(
                    paginatedState.meta.current_page,
                    paginatedState.meta.per_page,
                    order ? columns[sortIndex].field : "id",
                    order || "desc"
                  );
                }
              }}
            />
          ),
          Container: (props) => <Paper {...props} variant="table" />,
          ...(onDragEnd
            ? {
                Body: (props) => (
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable
                      droppableId={"singleColumnDroppableAreaThusStaticInput"}
                    >
                      {(provided) => (
                        <>
                          <MTableBody
                            {...props}
                            forwardedRef={provided.innerRef}
                          />
                          {provided.placeholder}
                        </>
                      )}
                    </Droppable>
                  </DragDropContext>
                ),
                Row: (props) => (
                  <Draggable
                    draggableId={props.data.tableData.id.toString()}
                    index={props.data.tableData.id}
                  >
                    {(provided) => {
                      return (
                        <MTableBodyRow
                          {...props}
                          {...provided.draggableProps}
                          dragHandleProps={provided.dragHandleProps}
                          forwardedRef={provided.innerRef}
                        />
                      );
                    }}
                  </Draggable>
                ),
              }
            : {}),
          ...components,
        }}
        options={{
          toolbar: false,
          draggable: false,
          pageSizeOptions: TABLE_ROWS_PER_PAGE,
          pageSize: paginatedState.meta.per_page,
          minBodyHeight: 300,
          ...options,
        }}
        onChangePage={(page, per_page) => {
          if (fetchData) {
            fetchData(
              page + 1,
              per_page,
              paginatedState.meta.sort,
              paginatedState.meta.order
            );
          }
        }}
        isLoading={props.isLoading}
        totalCount={paginatedState.meta.total}
        page={paginatedState.meta.current_page - 1}
        localization={{
          body: {
            emptyDataSourceMessage: (
              <Box py={2}>
                <img src={emptyTable} alt="" width={170} />
                <Typography>No data</Typography>
              </Box>
            ),
            ...localization?.body,
          },
          ...localization,
        }}
        {...props}
      />
    );
  }

  const paginatedState = state as unknown as PaginatedData<any>;
  return (
    <MaterialTable
      columns={columns}
      data={paginatedState.data}
      components={{
        Header: (props) => (
          <MTableHeader
            {...props}
            orderBy={columns.findIndex((a) => a.field === paginatedState.sort)}
            orderDirection={paginatedState.order}
            onOrderChange={(sortIndex: any, order: any) => {
              if (fetchData) {
                fetchData(
                  paginatedState.page,
                  paginatedState.per_page,
                  order ? columns[sortIndex].field : "id",
                  order || "desc"
                );
              }
            }}
          />
        ),
        Container: (props) => <Paper {...props} variant="table" />,
        ...(onDragEnd
          ? {
              Body: (props) => (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable
                    droppableId={"singleColumnDroppableAreaThusStaticInput"}
                  >
                    {(provided) => (
                      <>
                        <MTableBody
                          {...props}
                          forwardedRef={provided.innerRef}
                        />
                        {provided.placeholder}
                      </>
                    )}
                  </Droppable>
                </DragDropContext>
              ),
              Row: (props) => (
                <Draggable
                  draggableId={props.data.tableData.id.toString()}
                  index={props.data.tableData.id}
                >
                  {(provided) => {
                    return (
                      <MTableBodyRow
                        {...props}
                        {...provided.draggableProps}
                        dragHandleProps={provided.dragHandleProps}
                        forwardedRef={provided.innerRef}
                      />
                    );
                  }}
                </Draggable>
              ),
            }
          : {}),
        ...components,
      }}
      options={{
        toolbar: false,
        draggable: false,
        pageSizeOptions: TABLE_ROWS_PER_PAGE,
        pageSize: paginatedState.per_page,
        minBodyHeight: 300,
        ...options,
      }}
      onChangePage={(page, per_page) => {
        if (fetchData) {
          fetchData(
            page + 1,
            per_page,
            paginatedState.sort,
            paginatedState.order
          );
        }
      }}
      isLoading={paginatedState.loading}
      totalCount={paginatedState.total}
      page={paginatedState.page - 1}
      localization={{
        body: {
          emptyDataSourceMessage: (
            <Box py={2}>
              <img src={emptyTable} alt="" width={170} />
              <Typography>No data</Typography>
            </Box>
          ),
          ...localization?.body,
        },
        ...localization,
      }}
      {...props}
    />
  );
}

export default Table;

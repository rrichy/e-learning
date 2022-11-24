import { courseColumns } from "@/columns";
import { CourseRowAttribute } from "@/columns/rowTypes";
import MyTable from "@/components/atoms/MyTable";
import { RowSelectionState } from "@tanstack/react-table";
import { useEffect, useState } from "react";

interface CourseTableProps {
  data: CourseRowAttribute[];
  setIds: (d: { checked: number[]; unchecked: number[] }) => void;
}

function CourseTable({ data, setIds }: CourseTableProps) {
  const [selected, setSelected] = useState<RowSelectionState>({});

  const columns = courseColumns();

  useEffect(() => {
    const selectionState = data.reduce(
      (acc: { checked: number[]; unchecked: number[] }, row, index) => ({
        ...acc,
        [selected[index] ? "checked" : "unchecked"]: [
          ...acc[selected[index] ? "checked" : "unchecked"],
          row.id,
        ],
      }),
      { checked: [], unchecked: [] }
    );
    setIds(selectionState);
  }, [selected]);

  return (
    <MyTable
      state={{
        data,
        meta: {
          current_page: 1,
          last_page: 1,
          per_page: 10,
          total: 0,
        },
      }}
      columns={columns}
      selector={{ selected, setSelected }}
      bodyMinHeight={0}
    />
  );
}

export default CourseTable;

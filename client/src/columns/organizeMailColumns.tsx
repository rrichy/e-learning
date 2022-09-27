import { OrganizeMailFormAttributeWithId } from "@/validations/OrganizeMailFormValidation";
import { DragIndicator } from "@mui/icons-material";
import { Link } from "@mui/material";
import { Column } from "material-table";

export default function generate({
  lookup,
  titleClickFn,
  prioritySnapshot,
}: {
  lookup: { [k: number]: string };
  titleClickFn: (r: OrganizeMailFormAttributeWithId) => void;
  prioritySnapshot: Map<number, number>;
}) {
  const columns: Column<OrganizeMailFormAttributeWithId>[] = [
    {
      field: "id",
      render: () => <DragIndicator sx={{ cursor: "grab" }} />,
      width: "0%",
    },
    {
      field: "title",
      title: "タイトル",
      render: (row) => (
        <Link component="button" onClick={() => titleClickFn(row)}>
          {row.title}
        </Link>
      ),
    },
    { field: "content", title: "内容" },
    {
      field: "priority",
      title: "並び順",
      cellStyle: (_, row) => ({
        color:
          prioritySnapshot.get(row.id) !== row.priority ? "#00b4aa" : "inherit",
      }),
    },
    { field: "signature_id", title: "署名", lookup },
  ];

  return columns;
}

import Link from "@/components/atoms/Link";
import { UserAttributes } from "@/interfaces/AuthAttributes";
import { jpDate } from "@/mixins/jpFormatter";
import { Column } from "material-table";

export default function generate({
  affiliation_lookup,
  department_lookup,
}: {
  affiliation_lookup: { [k: number]: string };
  department_lookup: { [k: number]: string };
}) {
  const columns: Column<UserAttributes>[] = [
    {
      field: "email",
      title: "メールアドレス",
      render: (row) => (
        <Link to={`/account-management/${row.id}/details`}>{row.email}</Link>
      ),
    },
    { field: "name", title: "氏名" },
    {
      field: "affiliation_id",
      title: "所属",
      render: (row) => affiliation_lookup[row.affiliation_id ?? 0] ?? "-",
    },
    {
      field: "department_1",
      title: "部署１",
      render: (row) => department_lookup[row.department_1 ?? 0] ?? "-",
    },
    {
      field: "department_2",
      title: "部署２",
      render: (row) => department_lookup[row.department_2 ?? 0] ?? "-",
    },
    {
      field: "created_at",
      title: "登録日",
      render: (row) => jpDate(row.created_at),
    },
    {
      field: "last_login_date",
      title: "最終ログイン日",
      render: (row) => jpDate(row.last_login_date),
    },
  ];

  return columns;
}

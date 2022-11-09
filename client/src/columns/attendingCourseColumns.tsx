import { AttendingCourseAttributes } from "@/interfaces/AuthAttributes";
import { jpDate } from "@/mixins/jpFormatter";
import { Column } from "material-table";
  
export default function generate({
  course_lookup,
}: {
  course_lookup: { [k: number]: string };
}) {
  const columns: Column<AttendingCourseAttributes>[] = [
    { 
      field: "title", 
      title: "コース名", 
      render: (row) => course_lookup[row.course_id ?? 0] ?? "-",
    },
    { 
      field: "start_date", 
      title: "受講開始日",
      render: (row) => jpDate(row.start_date),

    },
    { 
      field: "completion_date", 
      title: "完了日",
      render: (row) => jpDate(row.completion_date),

    },
    { 
      field: "progress_rate", 
      title: "進捗率" 
    },
    { 
      field: "latest_score", 
      title: "最新得点" 
    },
  ];

  return columns;
}
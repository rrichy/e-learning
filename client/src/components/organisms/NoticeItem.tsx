import { Link, Stack, Typography } from "@mui/material";
import { NoticeItemAttribute } from "@/validations/NoticeFormValidation";
import { jpDate } from "@/mixins/jpFormatter";
import NoticeDetails from "../molecules/NoticeDetails";
import { useState } from "react";

function NoticeItem({ created_at, subject, id }: NoticeItemAttribute) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <Stack direction="row" spacing={2}>
      <Typography whiteSpace="nowrap">{jpDate(created_at)}</Typography>
      <Link
        component="button"
        color="secondary"
        textAlign="left"
        underline="hover"
        onClick={() => setSelected(id)}
      >
        {subject}
      </Link>
      <NoticeDetails id={selected} onClose={() => setSelected(null)} />
    </Stack>
  );
}

export default NoticeItem;

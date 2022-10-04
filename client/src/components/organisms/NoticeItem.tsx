import { Link, Stack, Typography } from "@mui/material";
import React from "react";
import { NoticeFormAttribute } from "@/validations/NoticeFormValidation";
import { jpDate } from "@/mixins/jpFormatter";

interface NoticeItemProps extends Omit<NoticeFormAttribute, "posting_method"> {
  created_at: string;
}

function NoticeItem({ created_at, subject }: NoticeItemProps) {
  return (
    <Stack direction="row" spacing={2}>
      <Typography whiteSpace="nowrap">{jpDate(created_at)}</Typography>
      <Link
        component="button"
        color="secondary"
        textAlign="left"
        underline="hover"
      >
        {subject}
      </Link>
    </Stack>
  );
}

export default NoticeItem;

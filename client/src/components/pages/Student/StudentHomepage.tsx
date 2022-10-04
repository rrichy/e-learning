import NoticeItem from "@/components/organisms/NoticeItem";
import Courses from "@/components/organisms/Student/HomepageFragment/Courses";
import Notice from "@/components/organisms/Student/HomepageFragment/Notice";
import useAlerter from "@/hooks/useAlerter";
import { initPaginatedData, OrderType } from "@/interfaces/CommonInterface";
import { indexNotice } from "@/services/NoticeService";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { NoticeItemAttribute } from "@/validations/NoticeFormValidation";
import { NavigateNext } from "@mui/icons-material";
import {
  Grid,
  Link,
  Pagination,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";

function StudentHomepage() {
  return (
    <Stack justifyContent="space-between">
      <Notice />
      <Courses />
    </Stack>
  );
}

export default StudentHomepage;

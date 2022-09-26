import { Dialog, DialogTitle, IconButton, Typography } from "@mui/material";
import { Stack } from "@mui/system";
import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@/components/atoms/Button";
import { FormContainer } from "react-hook-form-mui";
import CloseIcon from "@mui/icons-material/Close";
import useAlerter from "@/hooks/useAlerter";
import {
  CourseFormAttributeWithId,
  CourseListAttribute,
} from "@/validations/CourseFormValidation";
import { indexCourse, toggleCourses } from "@/services/CourseService";
import CourseManagementAccordion from "@/components/organisms/CourseManagementFragment/CourseManagementAccordion";
import CourseManagementSearchAccordion from "@/components/organisms/CourseManagementFragment/CourseManagementSearchAccordion";
import { getOptions } from "@/services/CommonService";
import { OptionAttribute } from "@/interfaces/CommonInterface";
import CourseList from "./CourseList";

function CourseManagement() {
  const mounted = useRef(true);
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [publicState, setPublicState] = useState<CourseListAttribute[]>([]);
  const [privateState, setPrivateState] = useState<CourseListAttribute[]>([]);
  const [publicSelected, setPublicSelected] = useState(
    new Map<number, CourseFormAttributeWithId[]>()
  );
  const [privateSelected, setPrivateSelected] = useState(
    new Map<number, CourseFormAttributeWithId[]>()
  );
  const [courseStatusOpen, setCourseStatusOpen] = useState(false);
  const [categories, setCategories] = useState<OptionAttribute[]>([
    { id: 0, name: "未選択", selectionType: "disabled" },
  ]);
  const [openTable, setOpenTable] = useState(false);

  const fetchData = useCallback(async (status: "public" | "private") => {
    try {
      let setState = status === "public" ? setPublicState : setPrivateState;
      const res = await indexCourse(status);
      const { data } = res.data;
      if (mounted.current) setState(data);
    } catch (e: any) {
      errorSnackbar(e.message);
    }
  }, []);

  const handleSelect = (
    status: "public" | "private",
    category_id: number,
    rows: CourseFormAttributeWithId[]
  ) => {
    let [selected, setSelected] =
      status === "public"
        ? [publicSelected, setPublicSelected]
        : [privateSelected, setPrivateSelected];

    const temp = new Map(selected);
    temp.set(category_id, rows);
    setSelected(temp);
  };

  const handleToggleStatus = async (oldStatus: "public" | "private") => {
    try {
      const ids: number[] = [];
      let selected = privateSelected;
      let newStatus: "public" | "private" = "public";
      if (oldStatus === "public") {
        selected = publicSelected;
        newStatus = "private";
      }

      selected.forEach((value) => ids.push(...value.map((a) => a.id)));

      const res = await toggleCourses(newStatus, ids);
      successSnackbar(res.data.message);
      fetchData("public");
      fetchData("private");
    } catch (e: any) {
      errorSnackbar(e.message);
    }
  };

  useEffect(() => {
    mounted.current = true;
    fetchData("public");
    fetchData("private");

    (async () => {
      try {
        const res = await getOptions(["categories"]);
        setCategories([
          { id: 0, name: "未選択", selectionType: "disabled" },
          ...res.data.categories,
        ]);
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, []);

  return (
    <>
      <Stack
        spacing={3}
        sx={{
          p: 3,
          "& tbody tr:nth-last-of-type(1) td": {
            borderBottom: "none !important",
          },
        }}
      >
        <FormContainer>
          <CourseManagementSearchAccordion categories={categories} />
        </FormContainer>
        <Stack
          spacing={2}
          justifyContent="center"
          direction="row"
          sx={{ "& .MuiButton-root": { maxWidth: 200 } }}
        >
          <Button to="create" variant="contained" rounded>
            新規作成
          </Button>
          <Button
            variant="contained"
            rounded
            onClick={() => setOpenTable(true)}
          >
            コース整理
          </Button>
        </Stack>

        <CourseManagementAccordion
          status="public"
          categories={publicState}
          selected={publicSelected}
          onSelect={handleSelect}
          onToggle={handleToggleStatus}
        />

        <CourseManagementAccordion
          status="private"
          categories={privateState}
          selected={privateSelected}
          onSelect={handleSelect}
          onToggle={handleToggleStatus}
        />
      </Stack>

      {/* unfinished */}
      <CourseList
        open={openTable}
        onClose={() => setOpenTable(false)}
        // resolveFn={() => null}
      />
    </>
  );
}

export default CourseManagement;

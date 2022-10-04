import { useCallback, useEffect, useRef, useState } from "react";
import useAlerter from "@/hooks/useAlerter";
import {
  CourseFormAttributeWithId,
  CourseListAttribute,
} from "@/validations/CourseFormValidation";
import { indexCourse, toggleCourses } from "@/services/CourseService";
import { getOptions } from "@/services/CommonService";
import { OptionAttribute } from "@/interfaces/CommonInterface";

function useCourse() {
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

  return {
    categories,
    setOpenTable,
    publicState,
    publicSelected,
    handleSelect,
    handleToggleStatus,
    privateState,
    privateSelected,
    openTable,
  };
}

export default useCourse;

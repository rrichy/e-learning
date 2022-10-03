import { useCallback, useEffect, useRef, useState } from "react";
import useAlerter from "@/hooks/useAlerter";
import {
  initPaginatedData,
  OrderType,
  PageDialogProps,
} from "@/interfaces/CommonInterface";
import { CategoryFormAttributeWithId } from "@/validations/CategoryFormValidation";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import {
  destroyCategory,
  duplicateCategory,
  indexCategory,
} from "@/services/CategoryService";
import categoryColumns from "@/columns/categoryColumns";

function useCategory() {
  const mounted = useRef(true);
  const { successSnackbar, errorSnackbar } = useAlerter();
  const [categoriesState, setCategoriesState] = useState(
    initPaginatedData<CategoryFormAttributeWithId>()
  );
  const [categorySelected, setCategorySelected] = useState<
    CategoryFormAttributeWithId[]
  >([]);
  const [categoryDialog, setCategoryDialog] =
    useState<PageDialogProps<CategoryFormAttributeWithId>>(null);

  const fetchCategories = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof CategoryFormAttributeWithId = "id",
      order: OrderType = "desc"
    ) => {
      try {
        setCategoriesState((s) => ({
          ...s,
          page,
          order,
          sort,
          per_page: pageSize,
          loading: true,
        }));
        setCategorySelected([]);

        const res = await indexCategory(page, pageSize, sort, order);
        const { data, meta } = res.data;
        if (mounted.current)
          setCategoriesState((s) => ({
            ...s,
            loading: false,
            data: data.reduce(
              (acc: any, parent: any) =>
                acc.concat(parent, ...parent.child_categories),
              []
            ),
            page: meta.current_page,
            total: meta.total,
            order,
            sort,
            per_page: meta.per_page,
            last_page: meta.last_page,
          }));
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setCategoriesState((s) => ({ ...s, loading: false }));
      }
    },
    []
  );

  const handleDelete = async () => {
    try {
      setCategoriesState((s) => ({ ...s, loading: true }));
      const res = await destroyCategory(categorySelected.map((a) => a.id));
      successSnackbar(res.data.message);
      fetchCategories();
    } catch (e: any) {
      errorSnackbar(e.message);
    } finally {
      setCategoriesState((s) => ({ ...s, loading: false }));
    }
  };

  const handleDuplicate = async (category: CategoryFormAttributeWithId) => {
    try {
      setCategoriesState((s) => ({ ...s, loading: true }));
      const res = await duplicateCategory(category.id);
      successSnackbar(res.data.message);
      fetchCategories();
    } catch (e: any) {
      errorSnackbar(e.message);
    } finally {
      setCategoriesState((s) => ({ ...s, loading: false }));
    }
  };

  const columns = categoryColumns({
    setCategoryDialog,
    categoriesState,
    handleDuplicate,
  });

  useEffect(() => {
    mounted.current = true;
    fetchCategories();

    return () => {
      mounted.current = false;
    };
  }, []);

  return {
    handleDelete,
    categorySelected,
    setCategoryDialog,
    columns,
    categoriesState,
    fetchCategories,
    setCategorySelected,
    categoryDialog,
  };
}

export default useCategory;

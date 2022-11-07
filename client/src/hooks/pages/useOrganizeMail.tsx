import { useCallback, useEffect, useRef, useState } from "react";
import useAlerter from "@/hooks/useAlerter";
import {
  initPaginatedData,
  OptionAttribute,
  OrderType,
  PageDialogProps,
} from "@/interfaces/CommonInterface";
import { TABLE_ROWS_PER_PAGE } from "@/settings/appconfig";
import { OrganizeMailFormAttributeWithId } from "@/validations/OrganizeMailFormValidation";
import {
  destroyOrganizeMail,
  indexOrganizeMail,
  massUpdateOrganizeMailPriority,
} from "@/services/OrganizeMailService";
import { getOptions } from "@/services/CommonService";
import arrayMoveTo from "@/utils/arrayMoveTo";
import useConfirm from "@/hooks/useConfirm";
import { DropResult } from "@hello-pangea/dnd";
import organizeMailColumns from "@/columns/organizeMailColumns";

function useOrganizeMail() {
  const mounted = useRef(true);
  const { successSnackbar, errorSnackbar } = useAlerter();
  const { isConfirmed } = useConfirm();
  const [state, setState] = useState(
    initPaginatedData<OrganizeMailFormAttributeWithId>()
  );
  const [snapshot, setSnapshot] = useState<OrganizeMailFormAttributeWithId[]>(
    []
  );
  // keyof id value of priority
  const [prioritySnapshot, setPrioritySnapshot] = useState(
    new Map<number, number>()
  );
  const [changes, setChanges] = useState<{ id: number; priority: number }[]>(
    []
  );
  const [stateSelected, setStateSelected] = useState<
    OrganizeMailFormAttributeWithId[]
  >([]);
  const [signatures, setSignatures] = useState({
    lookup: {} as { [k: number]: string },
    option: [
      { id: 0, name: "未選択", selectionType: "disabled" },
    ] as OptionAttribute[],
  });
  const [dialog, setDialog] =
    useState<PageDialogProps<OrganizeMailFormAttributeWithId>>(null);

  const fetchData = useCallback(
    async (
      page: number = 1,
      pageSize: number = TABLE_ROWS_PER_PAGE[0],
      sort: keyof OrganizeMailFormAttributeWithId = "priority",
      order: OrderType = "asc"
    ) => {
      try {
        setState((s) => ({
          ...s,
          page,
          order,
          sort,
          per_page: pageSize,
          loading: true,
        }));
        setChanges([]);
        setStateSelected([]);

        const res = await indexOrganizeMail(page, pageSize, sort, order);
        const { data, meta } = res.data;
        if (mounted.current) {
          setState((s) => ({
            ...s,
            loading: false,
            data,
            page: meta.current_page,
            total: meta.total,
            order,
            sort,
            per_page: meta.per_page,
            last_page: meta.last_page,
          }));
          setSnapshot(data);
          setPrioritySnapshot(
            new Map(
              data.map((a: OrganizeMailFormAttributeWithId) => [
                a.id,
                a.priority,
              ])
            )
          );
        }
      } catch (e: any) {
        errorSnackbar(e.message);
      } finally {
        setState((s) => ({ ...s, loading: false }));
      }
    },
    []
  );

  const handleDelete = async () => {
    try {
      setState((s) => ({ ...s, loading: true }));
      const res = await destroyOrganizeMail(stateSelected.map((a) => a.id));
      successSnackbar(res.data.message);
      fetchData();
    } catch (e: any) {
      errorSnackbar(e.message);
    } finally {
      setState((s) => ({ ...s, loading: false }));
    }
  };

  const handleDragEnd = ({ source, destination }: DropResult) => {
    if (destination && source.index !== destination.index) {
      const newdata = arrayMoveTo(
        [...state.data],
        source.index,
        destination.index,
        "priority"
      );

      setState({
        ...state,
        data: newdata,
      });
      const changes = newdata.reduce(
        (acc, { id, priority }) =>
          prioritySnapshot.get(id) !== priority
            ? [...acc, { id, priority }]
            : acc,
        [] as { id: number; priority: number }[]
      );

      setChanges(changes);
    }
  };

  const handleRevertOrder = () => {
    setState({
      ...state,
      data: snapshot,
    });
    setChanges([]);
  };

  const handleUpdateOrder = async () => {
    const confirmed = await isConfirmed({
      title: "update priorty",
      content: "update priority",
    });
    if (confirmed) {
      try {
        const res = await massUpdateOrganizeMailPriority(changes);

        successSnackbar(res.data.message);
        fetchData(state.page, state.per_page, state.sort, state.order);
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    }
  };

  const columns = organizeMailColumns({
    lookup: signatures.lookup,
    titleClickFn: setDialog,
    prioritySnapshot,
  });

  useEffect(() => {
    mounted.current = true;
    fetchData();

    (async () => {
      try {
        const res = await getOptions(["signatures"]);
        setSignatures({
          lookup: res.data.signatures.reduce(
            (acc: any, b: any) => ({ ...acc, [b.id]: b.name }),
            {} as any
          ),
          option: [
            { id: 0, name: "未選択", selectionType: "disabled" },
            ...res.data.signatures,
          ],
        });
      } catch (e: any) {
        errorSnackbar(e.message);
      }
    })();

    return () => {
      mounted.current = false;
    };
  }, [errorSnackbar]);

  return {
    handleDelete,
    stateSelected,
    setDialog,
    handleRevertOrder,
    changes,
    handleUpdateOrder,
    columns,
    state,
    fetchData,
    setStateSelected,
    handleDragEnd,
    dialog,
    signatures,
  };
}

export default useOrganizeMail;

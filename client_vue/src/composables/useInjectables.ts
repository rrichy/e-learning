import { ItemAttributes } from "@/interfaces/ItemAttributes";
import { inject, ref } from "vue";

// This composable is used for form fields to inject value and update handler to the
// field component;
export default function useInjectables(
  props: Readonly<{ name: string; disabled?: boolean; [k: string]: unknown }>
) {
  const injectedItems = inject("items:" + props.name, undefined) as
    | ItemAttributes[]
    | undefined;

  const injectedDisabled = inject("inject:disabled", undefined) as
    | boolean
    | undefined;

  const items = ref((props.items || injectedItems || []) as ItemAttributes[]);
  const disabled = ref(props.disabled || injectedDisabled);

  return {
    items,
    disabled,
  };
}

import { ItemAttributes } from "@/interfaces/ItemAttributes";
import { inject, Ref, useAttrs } from "vue";

// This composable is used for form fields to inject value and update handler to the
// field component;
export default function useInjectables<Value>() {
  // attempt to inject with attrs.name
  const attrs = useAttrs();
  const name = attrs.name as string | undefined;
  const injectedItems = inject("items:" + name, undefined) as
    | ItemAttributes[]
    | undefined;

  const injectedValue = inject("value:" + name, undefined) as
    | Ref<Value>
    | undefined;

  const injectedChange = inject("update:" + name, undefined) as
    | ((v: Value) => void)
    | undefined;

  return {
    attrs,
    name,
    injectedItems,
    injectedValue,
    injectedChange,
  };
}

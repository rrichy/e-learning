import { inject, ref } from "vue";

// This composable is used for form fields to inject value and update handler to the
// field component;
export default function useInjectables(
  props: Readonly<{ name: string; disabled?: boolean; [k: string]: unknown }>
) {
  const injectedDisabled = inject("inject:disabled", undefined) as
    | boolean
    | undefined;

  const disabled = ref(props.disabled || injectedDisabled);

  return {
    disabled,
  };
}

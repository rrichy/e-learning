import { useIsSubmitting } from "vee-validate";
import { provide, inject, ref, Ref, computed } from "vue";

// useDisabled is located not in stores because we want to scope the disable prop to a component's descendants
// and not globally (pinia stores globally)
export default {
  provide: (props?: Readonly<{ disabled?: boolean; [k: string]: unknown }>) => {
    const disabled: Ref<boolean | undefined> = ref(props?.disabled);

    provide("inject:disabled", disabled);
  },
  inject: (props: Readonly<{ disabled?: boolean; [k: string]: unknown }>) => {
    const isSubmitting = useIsSubmitting();
    const injectedDisabled = inject("inject:disabled", undefined) as
      | Ref<boolean | undefined>
      | undefined;

    const disabled = computed(
      () => props.disabled || isSubmitting.value || injectedDisabled?.value
    );

    return { disabled };
  },
};

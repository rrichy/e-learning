import { AppForm, FormBase } from "@/interfaces/Forms/FormBase";
import { useForm } from "vee-validate";
import { inject, provide, Ref, ref } from "vue";

export default {
  provide: () => {
    const show = ref(false);
    const proceed: Ref<((v: unknown) => void) | null> = ref(null);
    const cancel: Ref<((v: unknown) => void) | null> = ref(null);
    const { resetForm, values } = useForm<FormBase>();

    // function to display the window waiting for the user response
    function showConfirmation(
      values: FormBase = { discriminator: AppForm.BlankForm }
    ) {
      const promise = new Promise((resolve, reject) => {
        show.value = true;
        proceed.value = resolve;
        cancel.value = reject;
        resetForm({ values });
      });

      const cleanup = () => {
        show.value = false;
        proceed.value = null;
        cancel.value = null;
        resetForm({ values: { discriminator: AppForm.BlankForm } });
      };

      return promise.then(
        () => {
          cleanup();
          return true;
        },
        () => {
          cleanup();
          return false;
        }
      );
    }

    provide("confirmation:state", {
      show,
      showConfirmation,
    });

    return { show, proceed, cancel, values };
  },
  inject: () => {
    const { show, showConfirmation } = inject("confirmation:state") as {
      show: Ref<boolean>;
      showConfirmation: (values?: FormBase) => Promise<boolean>;
    };

    return { show, showConfirmation };
  },
};

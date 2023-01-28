import { GroupedItemAttributes } from "@/interfaces/ItemAttributes";
import { defineStore } from "pinia";
import { reactive } from "vue";

const useItems = defineStore("items-store", () => {
  const storedItems = reactive({} as GroupedItemAttributes);

  function setItems(items: GroupedItemAttributes) {
    Object.assign(storedItems, items);
  }

  return { storedItems, setItems };
});

export default useItems;

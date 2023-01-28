import { GroupedItemAttributes } from "@/interfaces/ItemAttributes";
import { defineStore } from "pinia";
import { reactive } from "vue";

const useItemStore = defineStore("item-store", () => {
  const storedItems = reactive({} as GroupedItemAttributes);

  function setItems(items: GroupedItemAttributes) {
    Object.assign(storedItems, items);
  }

  return { storedItems, setItems };
});

export default useItemStore;

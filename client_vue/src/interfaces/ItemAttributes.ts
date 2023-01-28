export interface ItemAttributes {
  id: number;
  name: string;
  disabled?: boolean;
}

export type GroupedItemAttributes = { [k: string]: ItemAttributes[] };

import { OptionAttribute } from "@/interfaces/CommonInterface";

export default function generateLookup(options?: OptionAttribute[]) {
  const lookup: { [k: number]: string } = {};

  options?.forEach(({ id, name }) => {
    lookup[id as number] = name;
  });

  return lookup;
}

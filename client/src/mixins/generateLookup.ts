import { OptionAttribute } from "@/interfaces/CommonInterface";

export default function generateLookup(options?: OptionAttribute[]) {
  const lookup: { [k: number]: string } = {};

  if (options) {
    options.forEach(({ id, name }) => {
      lookup[id as number] = name;
    });
  }

  return lookup;
}

import { CommonContentAttributes } from "@/interfaces/ConfirmDialog";

export function isCommon(obj: any): obj is CommonContentAttributes {
  return obj && typeof obj === "object" && "title" in obj && "content" in obj;
}

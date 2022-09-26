import { Breakpoint } from "@mui/material";
import { ButtonProps } from "@/components/atoms/Button";

export interface ConfirmAttributes {
  prompt: React.ReactNode | CommonContentAttributes;
  isOpen: boolean;
  proceed: null | (() => boolean);
  cancel: null | (() => boolean);
  options: ConfirmOptionsAttributes;
}

export interface ConfirmOptionsAttributes {
  proceedLabel?: string;
  cancelLabel?: string;
  proceedButtonProps?: Omit<ButtonProps, "children">;
  cancelButtonProps?: Omit<ButtonProps, "children">;
  maxWidth?: Breakpoint;
}

export interface CommonContentAttributes {
  title: React.ReactNode;
  content: React.ReactNode;
}

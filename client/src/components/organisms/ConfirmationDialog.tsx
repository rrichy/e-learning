import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import Button from "@/components/atoms/Button";
import useConfirm from "@/hooks/useConfirm";
import { isCommon } from "@/utils/AlertUtilities";

function ConfirmationDialog() {
  const {
    prompt,
    isOpen = false,
    proceed,
    cancel,
    options = {},
  } = useConfirm();

  const {
    proceedLabel = "確認",
    cancelLabel = "キャンセル",
    maxWidth = "xs",
  } = options;

  return (
    <Dialog
      open={isOpen}
      maxWidth={maxWidth}
      fullWidth
      sx={{
        "& .MuiDialogTitle-root": {
          fontWeight: "bold",
        },
      }}
    >
      {isCommon(prompt) ? (
        <>
          <DialogTitle>{prompt.title}</DialogTitle>
          <DialogContent>
            <DialogContentText>{prompt.content}</DialogContentText>
          </DialogContent>
        </>
      ) : (
        prompt
      )}
      <DialogActions>
        <Button onClick={cancel || undefined} {...options?.cancelButtonProps}>
          {cancelLabel}
        </Button>
        <Button onClick={proceed || undefined} {...options?.proceedButtonProps}>
          {proceedLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;

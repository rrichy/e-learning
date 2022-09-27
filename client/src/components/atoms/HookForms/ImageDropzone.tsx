import { HighlightOff } from "@mui/icons-material";
import { Box, IconButton, Stack, StackProps } from "@mui/material";
import useConfirm from "@/hooks/useConfirm";
import useDisabledComponent from "@/hooks/useDisabledComponent";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Control, useController } from "react-hook-form";

const dropzoneRootStyle = {
  bgcolor: "#fafafa",
  color: "#bdbdbd",
  border: "2px dashed #eeeeee",
  textAlign: "center",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  transition: "border .24s ease-in-out",
  rowGap: 2,
  overflow: "hidden",
  "& img": {
    width: 1,
    aspectRatio: "1 / 1",
    objectFit: "cover",
  },
} as const;

const deleteButtonStyle = {
  position: "absolute",
  top: 0,
  right: 0,
} as const;

export interface ImageDropzoneProps {
  name: string;
  control?: Control<any>;
  required?: boolean;
  sx?: StackProps["sx"];
  placeholder?: React.ReactNode;
  hideRemove?: boolean;
  disabled?: boolean;
}

function ImageDropzone({
  name,
  control,
  required,
  sx,
  placeholder,
  hideRemove,
  disabled: disabledProp,
}: ImageDropzoneProps) {
  const disabledChild = useDisabledComponent();
  const disabled = disabledProp || disabledChild;
  const { isConfirmed } = useConfirm();

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    rules: required ? { required: "This field is required" } : undefined,
    control,
  });

  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      onChange(null);
      acceptedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => onChange([file, reader.result]);
        reader.readAsDataURL(file);
      });
    },
    [disabled]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      maxFiles: 1,
      accept: {
        "image/*": [".jpeg", ".png"],
      },
      minSize: 0,
      maxSize: 5_242_880,
      onDropAccepted,
    });

  const handleRemoveImage = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const confirmed = await isConfirmed(
      { title: "画像を削除する", content: "画像を削除しますか" },
      { maxWidth: "xs" }
    );
    if (confirmed) onChange(null);
  };

  return (
    <Stack
      {...getRootProps()}
      direction={!value ? "column" : "row"}
      position="relative"
      sx={[
        dropzoneRootStyle,
        isDragAccept && { borderColor: "success.main" },
        (isDragReject || Boolean(error)) && { borderColor: "error.main" },
        Boolean(sx) && (sx as any),
      ]}
    >
      <input name="files" {...getInputProps()} disabled={disabled} />
      {!value ? (
        placeholder || (
          <p style={{ marginBottom: 16 }}>
            画像のアップロード
            <br />
            (画像ファイルのみを受けてい入れられます。)
          </p>
        )
      ) : (
        <>
          <Box position="relative" className="image-wrapper">
            <img src={typeof value === "string" ? value : value[1]} alt="" />
          </Box>
          {!hideRemove && (
            <IconButton
              type="button"
              size="small"
              onClick={handleRemoveImage}
              color="error"
              disabled={disabled}
              sx={deleteButtonStyle}
            >
              <HighlightOff fontSize="small" />
            </IconButton>
          )}
        </>
      )}
    </Stack>
  );
}

export default ImageDropzone;

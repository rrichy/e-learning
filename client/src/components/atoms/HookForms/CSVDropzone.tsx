import useDisabledComponent from "@/hooks/useDisabledComponent";
import readableByte from "@/utils/readableByte";
import { Stack } from "@mui/material";
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
  width: 1,
  minHeight: 100,
  px: 2,
  whiteSpace: "pre-line",
} as const;

export interface CSVDropzoneProps {
  name: string;
  control?: Control<any>;
  required?: boolean;
  placeholder?: React.ReactNode;
  hideRemove?: boolean;
  disabled?: boolean;
}

function CSVDropzone({
  name,
  control,
  required,
  placeholder,
  disabled: disabledProp,
}: CSVDropzoneProps) {
  const disabledChild = useDisabledComponent();
  const disabled = disabledProp || disabledChild;

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
      URL.revokeObjectURL(value?.[1]);
      onChange(null);
      acceptedFiles.forEach((file) => {
        onChange([file, URL.createObjectURL(file)]);
      });
    },
    [value, disabled]
  );

  const { getRootProps, getInputProps, isDragAccept, isDragReject } =
    useDropzone({
      maxFiles: 1,
      accept: {
        "text/csv": [".csv"],
      },
      minSize: 0,
      onDropAccepted,
    });

  return (
    <Stack
      {...getRootProps()}
      direction={!value ? "column" : "row"}
      position="relative"
      sx={[
        dropzoneRootStyle,
        isDragAccept && { borderColor: "success.main" },
        (isDragReject || Boolean(error)) && { borderColor: "error.main" },
      ]}
    >
      <input name="files" {...getInputProps()} disabled={disabled} />
      {!value ? (
        placeholder || (
          <p style={{ marginBottom: 16 }}>
            動画のアップロード
            <br />
            (動画ファイルのみを受けてい入れられます。)
          </p>
        )
      ) : typeof value === "string" ? (
        <p>{value}</p>
      ) : (
        <p style={{ marginBottom: 16 }}>
          {value[0].name}
          <br />
          {readableByte(value[0].size)}
        </p>
      )}
    </Stack>
  );
}

export default CSVDropzone;

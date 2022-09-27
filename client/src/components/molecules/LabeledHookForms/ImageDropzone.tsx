import {
  ImageDropzone as AImageDropzone,
  ImageDropzoneProps as AImageDropzoneProps,
} from "@/components/atoms/HookForms";
import { UserIcon } from "@/components/atoms/Icons";
import Labeler, { LabelerSupplementaryProps } from "../Labeler";

interface ImageDropzoneProps extends AImageDropzoneProps {
  label: string;
  labelProps?: LabelerSupplementaryProps;
}

function ImageDropzone({ label, labelProps, ...rest }: ImageDropzoneProps) {
  return (
    <Labeler label={label} {...labelProps}>
      <AImageDropzone
        {...rest}
        placeholder={<UserIcon sx={{ fontSize: 140, color: "common.black" }} />}
        sx={{
          borderRadius: 100,
          width: "fit-content",
          maxWidth: 144,
          borderColor: "common.black",
          "& .image-wrapper": {
            borderRadius: 100,
            width: "fit-content",
            maxWidth: 144,
            borderColor: "common.black",
            overflow: "hidden",
          },
        }}
      />
    </Labeler>
  );
}

export default ImageDropzone;

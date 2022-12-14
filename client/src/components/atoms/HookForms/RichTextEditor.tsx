import { Save } from "@mui/icons-material";
import { convertToRaw } from "draft-js";
import MUIRichTextEditor from "mui-rte";
import { useState } from "react";
import { useController } from "react-hook-form";

interface RichTextEditorProps {
  name: string;
}

function RichTextEditor({ name }: RichTextEditorProps) {
  const [isDirtyRTE, setIsDirtyRTE] = useState(false);
  const {
    field: { value, onChange },
  } = useController({
    name,
  });

  return (
    <MUIRichTextEditor
      defaultValue={value}
      label="Type something here..."
      controls={[
        "title",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "highlight",
        "undo",
        "redo",
        "link",
        "numberList",
        "bulletList",
        "quote",
        "code",
        "clear",
        "my-save",
      ]}
      onChange={(state) => {
        const newValue = JSON.stringify(
          convertToRaw(state.getCurrentContent())
        );
        setIsDirtyRTE(newValue !== value);
      }}
      customControls={[
        {
          name: "my-save",
          icon: <Save color={isDirtyRTE ? "primary" : "inherit"} />,
          type: "callback",
          onClick: (state) =>
            onChange(JSON.stringify(convertToRaw(state.getCurrentContent()))),
        },
      ]}
    />
  );
}

export default RichTextEditor;

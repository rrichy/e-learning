import Button from "@/components/atoms/Button";
import { TextField as ATextField } from "@/components/atoms/HookForms";
import { Delete, DragHandle } from "@mui/icons-material";
import {
  FormControlLabel,
  Grid,
  IconButton,
  Radio,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { QuestionAttributes } from "@/validations/CourseFormValidation";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

function RadioQuestion() {
  const { watch, control, setValue } = useFormContext<QuestionAttributes>();
  const format = watch("format");

  const { fields, append, remove, move } = useFieldArray({
    control,
    keyName: "fieldKey",
    name: "options",
  });

  const [display, setDisplay] = useState(
    fields.find(({ correction_order }) => correction_order)?.description || ""
  );

  if (format !== 1) return null;

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <DragDropContext
          onDragEnd={({ source, destination }) => {
            if (destination && source.index !== destination.index) {
              move(source.index, destination.index);
            }
          }}
        >
          <Droppable droppableId="question-options-droppable">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                <Stack spacing={2}>
                  {fields.map(({ fieldKey, ...option }, index) => (
                    <Draggable
                      key={index}
                      draggableId={fieldKey + index}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >
                          <FormControlLabel
                            key={fieldKey}
                            control={
                              <Radio
                                checked={Boolean(option.correction_order)}
                                onChange={(_e) => {
                                  const temp = fields.map((option, i) => ({
                                    ...option,
                                    correction_order: i === index ? 1 : null,
                                  }));
                                  setDisplay(option.description);
                                  setValue("options", temp);
                                }}
                              />
                            }
                            sx={{ width: 1 }}
                            componentsProps={{
                              typography: {
                                width: 1,
                              },
                            }}
                            label={
                              <Stack
                                direction="row"
                                spacing={2}
                                width={1}
                                flex={1}
                                alignItems="center"
                              >
                                <ATextField
                                  name={`options.${index}.description`}
                                  label="テキスト"
                                  size="small"
                                  fullWidth
                                  onChange={(e) =>
                                    option.correction_order &&
                                    setDisplay(e.target.value)
                                  }
                                  onBlur={(e) => {
                                    const temp = [...fields];
                                    temp[index].description = e.target.value;
                                    setValue("options", temp);
                                  }}
                                />
                                <IconButton
                                  type="button"
                                  onClick={() => {
                                    if (option.correction_order) setDisplay("");
                                    remove(index);
                                  }}
                                >
                                  <Delete />
                                </IconButton>
                                <div {...provided.dragHandleProps}>
                                  <DragHandle />
                                </div>
                              </Stack>
                            }
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          type="button"
          rounded
          sx={{ maxWidth: "fit-content", float: "right" }}
          onClick={() =>
            append({ id: null, description: "", correction_order: null })
          }
        >
          Add✙
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="sectiontitle2">正解</Typography>
      </Grid>
      {fields.length > 0 && display && (
        <Grid item xs={12}>
          <FormControlLabel
            value={1}
            label={display}
            control={<Radio checked />}
          />
        </Grid>
      )}
    </React.Fragment>
  );
}

export default RadioQuestion;

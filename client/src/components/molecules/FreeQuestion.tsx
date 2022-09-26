import Button from "@/components/atoms/Button";
import { TextField as ATextField } from "@/components/atoms/HookForms";
import { Delete, DragHandle } from "@mui/icons-material";
import { Grid, IconButton, Stack, Typography } from "@mui/material";
import React from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { QuestionAttributes } from "@/validations/CourseFormValidation";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function FreeQuestion() {
  const { watch, control } = useFormContext<QuestionAttributes>();
  const format = watch("format");

  const { fields, append, remove, update, move } = useFieldArray({
    control,
    keyName: "fieldKey",
    name: "options",
  });

  if (format !== 3) return null;

  return (
    <React.Fragment>
      <Grid container item xs={12} spacing={2}>
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
                          key={fieldKey}
                          draggableId={fieldKey}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                            >
                              <Stack
                                direction="row"
                                spacing={2}
                                width={1}
                                flex={1}
                                alignItems="center"
                              >
                                <Typography
                                  width={50}
                                  fontWeight="bold"
                                  textAlign="right"
                                >
                                  {ALPHA[index]}:
                                </Typography>
                                <ATextField
                                  name={`options.${index}.description`}
                                  size="small"
                                  fullWidth
                                  onBlur={(e) =>
                                    update(index, {
                                      ...option,
                                      description: e.target.value,
                                    })
                                  }
                                />
                                <IconButton
                                  type="button"
                                  onClick={() => remove(index)}
                                >
                                  <Delete />
                                </IconButton>
                                <div {...provided.dragHandleProps}>
                                  <DragHandle />
                                </div>
                              </Stack>
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
                append({
                  id: null,
                  description: "",
                  correction_order: fields.length + 1,
                })
              }
            >
              Add✙
            </Button>
          </Grid>
        </React.Fragment>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="sectiontitle2">正解</Typography>
      </Grid>
      <Grid item xs={12}>
        {fields.map(({ fieldKey, description }, index) => (
          <Stack key={fieldKey} direction="row" spacing={2}>
            <Typography width={50} fontWeight="bold" textAlign="right">
              {ALPHA[index]}:
            </Typography>
            <Typography width={50} fontWeight="bold" flex={1}>
              {description}
            </Typography>
          </Stack>
        ))}
      </Grid>
    </React.Fragment>
  );
}

export default FreeQuestion;

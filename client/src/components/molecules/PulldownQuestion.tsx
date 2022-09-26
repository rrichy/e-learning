import Button from "@/components/atoms/Button";
import { Selection as ASelection } from "@/components/atoms/HookForms";
import { Delete, DragHandle } from "@mui/icons-material";
import {
  Chip,
  Grid,
  IconButton,
  Paper,
  Stack,
  TextField as MuiTextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { QuestionAttributes } from "@/validations/CourseFormValidation";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function PulldownQuestion() {
  const { watch, control, setValue } = useFormContext<QuestionAttributes>();
  const [format, correct_indexes] = watch(["format", "correct_indexes"]);

  const [newOption, setNewOption] = useState("");

  const { fields, append, remove, update } = useFieldArray({
    control,
    keyName: "fieldKey",
    name: "options",
  });

  const options = [
    { id: -1, name: "未選択", selectionType: "disabled" },
    ...fields.map(({ description, correction_order }, index) => ({
      id: index,
      name: description,
      selectionType: correction_order ? "disabled" : undefined,
    })),
  ];

  if (format !== 2) return null;

  return (
    <React.Fragment>
      <Grid container item xs={12} spacing={2}>
        <Controller
          name="correct_indexes"
          render={({ field: { name, value: values, onChange } }) => (
            <React.Fragment>
              <Grid item xs={12}>
                <DragDropContext
                  onDragEnd={({ source, destination }) => {
                    if (destination && source.index !== destination.index) {
                      const temp = [...values];
                      const [src, dest] = [
                        values[source.index],
                        values[destination.index],
                      ];
                      temp[source.index] = dest;
                      temp[destination.index] = src;
                      onChange(temp);
                    }
                  }}
                >
                  <Droppable droppableId="question-options-droppable">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <Stack spacing={2}>
                          {(values as number[]).map((value, index) => (
                            <Draggable
                              key={`v-${value}-i-${index}`}
                              draggableId={"draggable-option-" + index}
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
                                    <ASelection
                                      name={`${name}.${index}`}
                                      options={options}
                                      size="small"
                                      value={value}
                                      fullWidth
                                      onChange={(v) => {
                                        update(value, {
                                          ...fields[value],
                                          correction_order: null,
                                        });
                                        update(v, {
                                          ...fields[v],
                                          correction_order: index + 1,
                                        });

                                        const temp = [...values];
                                        temp[index] = v;
                                        onChange(temp);
                                      }}
                                    />
                                    <IconButton
                                      type="button"
                                      onClick={() => {
                                        update(value, {
                                          ...fields[value],
                                          correction_order: null,
                                        });
                                        const temp = [...values];
                                        temp.splice(index, 1);
                                        onChange(temp);
                                      }}
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
                  onClick={() => onChange([...values, -1])}
                >
                  Add✙
                </Button>
              </Grid>
            </React.Fragment>
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Paper
          variant="outlined"
          sx={{ p: "16px !important", bgcolor: "#f7f7f7" }}
        >
          <Typography fontWeight="bold" textAlign="center" gutterBottom>
            Choices
          </Typography>
          <Stack
            direction="row"
            gap={1}
            flexWrap="wrap"
            justifyContent="center"
          >
            {fields.map(({ fieldKey, ...option }, index) => (
              <Chip
                label={option.description}
                key={fieldKey}
                onDelete={() => {
                  remove(index);
                  setValue(
                    "correct_indexes",
                    correct_indexes
                      .filter((a) => a !== index)
                      .map((a) => (a > index ? a - 1 : a)),
                    { shouldTouch: true }
                  );
                }}
                color="primary"
              />
            ))}
          </Stack>
        </Paper>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={8}>
          <MuiTextField
            variant="standard"
            fullWidth
            placeholder="Enter a new option"
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="contained"
            type="button"
            disabled={!newOption}
            onClick={() => {
              append({
                id: null,
                description: newOption,
                correction_order: null,
              });
              setNewOption("");
            }}
          >
            Add Option✙
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Typography variant="sectiontitle2">正解</Typography>
      </Grid>
      <Grid item xs={12}>
        {correct_indexes.map((cindex, index) =>
          cindex >= 0 ? (
            <Stack key={index} direction="row" spacing={2}>
              <Typography width={50} fontWeight="bold" textAlign="right">
                {ALPHA[index]}:
              </Typography>
              <Typography width={50} fontWeight="bold" flex={1}>
                {fields[cindex].description}
              </Typography>
            </Stack>
          ) : null
        )}
      </Grid>
    </React.Fragment>
  );
}

export default PulldownQuestion;

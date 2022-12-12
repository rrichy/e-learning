import CloseIcon from "@mui/icons-material/Cancel";
import { Control, Controller, FieldError } from "react-hook-form";
import {
  Checkbox,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  ListSubheader,
  MenuItem,
  Radio,
  Select,
  SelectProps,
} from "@mui/material";
import useDisabledComponent from "@/hooks/useDisabledComponent";
import useOptions from "@/hooks/useOptions";

export type MultiSelectionProps = Omit<SelectProps, "value"> & {
  options?: { id: string | number; label: string }[] | any[];
  label?: string;
  itemKey?: string;
  itemValue?: string;
  itemLabel?: string;
  required?: boolean;
  validation?: any;
  name: string;
  parseError?: (error: FieldError) => string;
  minWidth?: number;
  menuMaxHeight?: number;
  menuMaxWidth?: number;
  helperText?: string;
  showChips?: boolean;
  control?: Control<any>;
  showCheckbox?: boolean;
  showRadio?: boolean;
  hideSelectAll?: boolean;
};

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

function MultiSelection({
  options: optionsProp,
  disabled: disabledProp,
  label = "",
  itemKey = "id",
  itemValue = "id",
  itemLabel = "name",
  required = false,
  validation = {},
  parseError,
  name,
  menuMaxHeight = ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
  menuMaxWidth = 325,
  minWidth = 120,
  helperText,
  showChips,
  variant,
  control,
  showCheckbox,
  showRadio,
  hideSelectAll,
  ...rest
}: MultiSelectionProps): JSX.Element {
  const disabledChild = useDisabledComponent();
  const optionsChild = useOptions();
  const disabled = disabledProp || disabledChild;
  const options = [...(optionsProp || optionsChild?.[name] || [])];
  const lengthSelectable = options.filter((a) => !a.disabled).length;

  if (required && !validation.required) {
    validation.required = "This field is required";
  }

  return (
    <Controller
      name={name}
      rules={validation}
      control={control}
      render={({
        field: { value, onChange, onBlur },
        fieldState: { invalid, error },
      }) => {
        helperText = error
          ? typeof parseError === "function"
            ? parseError(error)
            : error.message
          : helperText;
        return (
          <FormControl
            variant={variant}
            style={{ minWidth }}
            fullWidth={rest.fullWidth}
            error={invalid}
            size={rest.size}
          >
            {label && (
              <InputLabel
                error={invalid}
                htmlFor={rest.id || `select-multi-select-${name}`}
                required={required}
              >
                {label}
              </InputLabel>
            )}
            <Select
              {...rest}
              id={rest.id || `select-multi-select-${name}`}
              multiple
              label={label || undefined}
              error={invalid}
              value={value || []}
              required={required}
              onChange={(event, c) => {
                const eValue = event.target.value;
                if (eValue[eValue.length - 1] === "all") {
                  const select =
                    eValue.length - 1 === lengthSelectable
                      ? []
                      : options.reduce(
                          (bucket, option) =>
                            !option.disabled
                              ? bucket.concat(option[itemValue] || option)
                              : bucket,
                          [] as any[]
                        );
                  onChange(select);
                } else {
                  onChange(event);
                }
                if (rest.onChange) rest.onChange(event, c);
              }}
              onBlur={onBlur}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: menuMaxHeight,
                    width: menuMaxWidth,
                  },
                },
              }}
              disabled={disabled}
              renderValue={
                typeof rest.renderValue === "function"
                  ? rest.renderValue
                  : showChips
                  ? (selected) => (
                      <div style={{ display: "flex", flexWrap: "wrap" }}>
                        {((selected as any[]) || []).map((selectedValue) => (
                          <Chip
                            key={selectedValue}
                            label={selectedValue}
                            style={{ display: "flex", flexWrap: "wrap" }}
                            onDelete={() => {
                              onChange(
                                value.filter((i: any) => i !== selectedValue)
                              );
                            }}
                            deleteIcon={
                              <CloseIcon
                                onMouseDown={(ev) => {
                                  ev.stopPropagation();
                                }}
                              />
                            }
                          />
                        ))}
                      </div>
                    )
                  : (selected) =>
                      Array.isArray(selected)
                        ? selected
                            .filter(
                              (a: any) =>
                                a !== options[0][itemValue] || options[0]
                            )
                            .join(", ")
                        : ""
              }
            >
              {!hideSelectAll && (
                <MenuItem
                  value="all"
                  sx={{
                    fontWeight: (theme) =>
                      value.length > 0 && value.length === lengthSelectable
                        ? theme.typography.fontWeightBold
                        : theme.typography.fontWeightRegular,
                  }}
                >
                  {showCheckbox && (
                    <Checkbox
                      checked={
                        value.length > 0 && value.length === lengthSelectable
                      }
                      indeterminate={
                        value.length > 0 && value.length < lengthSelectable
                      }
                      size={rest.size}
                    />
                  )}
                  <ListItemText primary="すべて選択・未選択" />
                </MenuItem>
              )}
              {options.map((item) => {
                const val: string | number = item[itemValue] || item;
                const isChecked = Array.isArray(value)
                  ? value.includes(val)
                  : false;

                if (item.disabled)
                  return (
                    <ListSubheader key={item[itemKey]}>
                      {item[itemLabel] || item}
                    </ListSubheader>
                  );

                return (
                  <MenuItem
                    key={item[itemKey]}
                    value={val}
                    disabled={Boolean(item.disabled)}
                    sx={{
                      fontWeight: (theme) =>
                        isChecked
                          ? theme.typography.fontWeightBold
                          : theme.typography.fontWeightRegular,
                      ...item.sx,
                    }}
                  >
                    {showCheckbox && !Boolean(item.disabled) && (
                      <Checkbox checked={isChecked} size={rest.size} />
                    )}
                    {showRadio && !Boolean(item.disabled) && (
                      <Radio checked={isChecked} size={rest.size} />
                    )}
                    <ListItemText primary={item[itemLabel] || item} />
                  </MenuItem>
                );
              })}
            </Select>
            {helperText && <FormHelperText>{helperText}</FormHelperText>}
          </FormControl>
        );
      }}
    />
  );
}

export default MultiSelection;

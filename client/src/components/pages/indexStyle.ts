import { SxProps, Theme } from "@mui/material";

export default {
  py: { xs: 2, sm: 3 },
  maxWidth: { md: "calc(100vw - 257px)" },
  "& .MuiDataGrid-columnHeaders": {
    bgcolor: "common.black",
    "& .MuiCheckbox-root:not(.Mui-checked)": {
      color: "common.white",
    },
    "& .MuiDataGrid-iconButtonContainer > .MuiButtonBase-root": {
      color: "common.white",
    },
    "& .MuiDataGrid-columnHeaderTitle": {
      color: "common.white",
      fontWeight: "bold",
    },
  },
} as SxProps<Theme>;

import React from "react";
import { createTheme, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { TMUIRichTextEditorStyles } from "mui-rte";

declare module "@mui/material/Paper" {
  interface PaperPropsVariantOverrides {
    softoutline: true;
    subpaper: true;
    sectionsubpaper: true;
    table: true;
  }
}

declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    sectiontitle1: true;
    sectiontitle2: true;
    sectiontitle3: true;
  }
}

declare module "@mui/material/AppBar" {
  interface AppBarPropsVariantOverrides {
    softoutline: true;
  }
}

declare module "@mui/material/styles" {
  interface Palette {
    dull: Palette["primary"];
  }

  interface PaletteOptions {
    dull?: PaletteOptions["primary"];
  }

  interface CommonColors {
    gray: string;
    menuhover: string;
  }
}

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    dull: true;
  }
}

const breakpoint_values = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
};

const muiRteTheme: TMUIRichTextEditorStyles = {
  overrides: {
    MUIRichTextEditor: {
      root: {
        width: "100%",
      },
      container: {
        border: "1px solid rgba(0, 0, 0, 0.12)",
        borderRadius: 6,
        overflow: "hidden",
      },
      editor: {
        backgroundColor: "#fafafa",
        padding: "20px",
        height: "200px",
        maxHeight: "200px",
        overflow: "auto",
      },
      placeHolder: {
        position: "absolute",
        padding: "20px",
      },
      toolbar: {
        borderBottom: "1px solid rgba(0, 0, 0, 0.12)",
      },
    },
  },
};

const theme = createTheme({
  breakpoints: {
    values: breakpoint_values,
  },
  palette: {
    common: {
      black: "#222222",
      gray: "#333333",
      menuhover: "#444444",
    },
    primary: {
      main: "#00b4aa",
    },
    secondary: {
      main: "#ff4f00",
    },
    dull: {
      main: "#222222",
      contrastText: "#fff",
    },
    text: {
      primary: "#222222",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: "bold",
        },
        contained: {
          color: "#fff",
        },
        outlined: {
          backgroundColor: "#fff",
          borderWidth: 2,
          "&:hover, &.Mui-disabled": {
            borderWidth: 2,
          },
        },
      },
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: "softoutline" },
          style: {
            backgroundColor: "#ffffff",
            boxShadow: "0 0 3px 0 rgb(0 0 0 / 10%)",
            borderRadius: 0,
          },
        },
        {
          props: { variant: "subpaper" },
          style: {
            backgroundColor: "#fff",
            position: "relative",
            borderRadius: 6,
            padding: 24,
            [`@media (min-width: ${breakpoint_values.md}px)`]: {
              padding: 48,
            },
            border: "1px solid rgba(0, 0, 0, 0.12)",
          },
        },
        {
          props: { variant: "sectionsubpaper" },
          style: {
            backgroundColor: "#fafafa",
            position: "relative",
            overflow: "hidden",
            borderRadius: 6,
            // padding: "0 24px 24px",
            [`@media (min-width: ${breakpoint_values.md}px)`]: {
              // padding: "0 48px 48px",
              // paddingBottom: 48
            },
            border: "1px solid rgba(0, 0, 0, 0.12)",
          },
        },
        {
          props: { variant: "table" },
          style: {
            backgroundColor: "#ffffff",
            overflow: "auto",
            border: "1px solid rgba(0, 0, 0, 0.12)",
            "& tr": {
              fontSize: 14,
            },
            "& td": {
              textAlign: "center",
            },
            "& .MuiTableRow-head th": {
              backgroundColor: "#222222",
              borderBottom: "none",
              color: "#fff !important",
              fontWeight: "bold",
              textAlign: "center",
              "& .MuiCheckbox-root:not(.Mui-checked):not(.MuiCheckbox-indeterminate)":
                {
                  color: "#fff",
                },
              "& .MuiTableSortLabel-root, & .MuiTableSortLabel-icon": {
                color: "#fff !important",
                fontWeight: "bold",
              },
            },
            "& .MuiTableRow-root": {
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: "#0000000a",
              },
              /* background-color: rgba(0, 180, 170, 0.08); */
            },
            "& .MuiTablePagination-root": {
              border: "none",
            },
          },
        },
      ],
      styleOverrides: {
        outlined: {
          borderColor: "#e6e6e6",
          position: "relative",
          borderRadius: 6,
          padding: 24,
          [`@media (min-width: ${breakpoint_values.md}px)`]: {
            padding: 48,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#fafafa",
        },
      },
    },
    MuiTypography: {
      variants: [
        {
          props: { variant: "sectiontitle1" },
          style: {
            backgroundColor: "#323232",
            color: "#ffffff",
            fontSize: 20,
            fontWeight: "bold",
            padding: "16px 10px 12px 12px",
            borderLeft: "5px solid #00b4aa",
            display: "block",
          },
        },
        {
          props: { variant: "sectiontitle2" },
          style: {
            color: "#222222",
            fontSize: 20,
            fontWeight: "bold",
            paddingLeft: 8,
            borderLeft: "5px solid #00b4aa",
            display: "block",
          },
        },
        {
          props: { variant: "sectiontitle3" },
          style: {
            backgroundColor: "#222222",
            color: "#ffffff",
            fontSize: 20,
            fontWeight: "bold",
            padding: "16px 10px 12px 12px",
            display: "block",
          },
        },
      ],
    },
    MuiAppBar: {
      variants: [
        {
          props: { variant: "softoutline" },
          style: {
            backgroundColor: "#ffffff",
            boxShadow: "1px 0 3px 0 rgb(0 0 0 / 10%))",
            borderRadius: 0,
          },
        },
      ],
    },
  },
});

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <MuiThemeProvider theme={{ ...theme, ...muiRteTheme }}>
      {children}
    </MuiThemeProvider>
  );
}

export default ThemeProvider;

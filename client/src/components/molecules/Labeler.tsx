import { Divider, Grid, Typography, TypographyProps } from "@mui/material";

export interface LabelerSupplementaryProps {
  noDiv?: boolean;
  compact?: boolean;
  typographyProps?: TypographyProps;
  accent?: boolean;
}

interface LabelerProps extends LabelerSupplementaryProps {
  label: React.ReactNode;
  children: React.ReactNode;
}

function Labeler({
  label,
  children,
  noDiv = true,
  compact,
  typographyProps,
  accent,
}: LabelerProps) {
  return (
    <Grid container>
      <Grid
        item
        xs={12}
        md={compact ? 12 : 3}
        container
        alignItems="center"
        mb={{ xs: 1, md: compact ? 1 : 0 }}
      >
        {typeof label === "string" ? (
          <Typography
            variant="body2"
            fontWeight="bold"
            {...typographyProps}
            sx={[
              Boolean(accent) && {
                "&:before": {
                  content: "''",
                  height: 1,
                  pr: 1,
                  borderLeft: (t) => `3px solid ${t.palette.primary.main}`,
                },
              },
            ]}
          >
            {label}
          </Typography>
        ) : (
          label
        )}
      </Grid>
      <Grid item xs={12} md={compact ? 12 : 9}>
        {children}
      </Grid>
      {!noDiv && (
        <Grid item xs={12} my={1}>
          <Divider />
        </Grid>
      )}
    </Grid>
  );
}

export default Labeler;

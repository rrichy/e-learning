import { CircularProgress, Stack } from "@mui/material";

function Loading({ loading }: { loading?: boolean }) {
  if (!loading) return null;
  return (
    <Stack
      position="absolute"
      width={1}
      height={1}
      top={0}
      left={0}
      justifyContent="center"
      alignItems="center"
      bgcolor="#f9f9f980"
    >
      <CircularProgress />
    </Stack>
  );
}

export default Loading;

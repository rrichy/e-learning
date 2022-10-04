import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

interface CourseCardProps {}

function CourseCard({}: CourseCardProps) {
  return (
    <Grid item xs={6} md={4}>
      <Card elevation={0} sx={{ bgcolor: "transparent" }}>
        <CardActionArea>
          <CardMedia
            component="img"
            src="https://mui.com/static/images/cards/contemplative-reptile.jpg"
            sx={{ aspectRatio: "1 / .45", borderRadius: 1 }}
          />
          <CardContent sx={{ p: 0, pt: 1 }}>
            <Typography gutterBottom fontWeight="bold" component="h5">
              CCNAコース【前編】
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={{ xs: 1, md: 2 }}
              alignItems={{ xs: "flex-start", md: "center" }}
              sx={{ strong: { fontSize: 18 } }}
            >
              <Typography
                variant="body2"
                color="common.white"
                bgcolor="common.black"
                p="4px 8px"
                borderRadius={1}
                whiteSpace="nowrap"
              >
                進捗率：
                <strong>100</strong>%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                受講開始から000日経過
              </Typography>
            </Stack>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
}

export default CourseCard;

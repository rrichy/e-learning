import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

interface CourseCardProps {
  id: number;
  title: string;
  image: string;
}

function CourseCard({ id, title, image }: CourseCardProps) {
  return (
    <Grid item xs={6} md={4}>
      <Card elevation={0} sx={{ bgcolor: "transparent" }}>
        <CardActionArea
          sx={{
            textDecoration: "none !important",
            position: "relative",
          }}
          component={RouterLink}
          to={`/course/${id}`}
        >
          <CardMedia
            component="img"
            src={image}
            sx={{ aspectRatio: "1 / .45", borderRadius: 1, objectFit: "cover" }}
          />
          <CardContent sx={{ p: 0, pt: 1 }}>
            <Typography gutterBottom fontWeight="bold" component="h5">
              {title}【前編】
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

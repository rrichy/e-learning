import { getTemporaryVideoUrl } from "@/services/AuthService";
import { VideoAttributes } from "@/validations/CourseFormValidation";
import { PlayCircleOutline } from "@mui/icons-material";
import {
  Box,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import MUIRichTextEditor from "mui-rte";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";

interface LecturePreviewProps {
  lectures: VideoAttributes[];
  chapterNumber: number;
}

function LecturePreview({ lectures, chapterNumber }: LecturePreviewProps) {
  const playerRef = useRef<any>(null);
  const [initialized, setInitialized] = useState(false);
  const [url, setUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const lecture = lectures[currentIndex];

  const handleChangeVideo = (index: number) => {
    setCurrentIndex(index);
    (async () => {
      try {
        if (lectures[index].video_file_path !== null) {
          if (typeof lectures[index].video_file_path === "string") {
            const res = await getTemporaryVideoUrl(
              lectures[index].video_file_path
            );
            setUrl(res.data.url);
          } else {
            setUrl(lectures[index].video_file_path[1]);
          }
        }
      } catch (e: any) {}
    })();
  };

  useEffect(() => {
    if (!initialized) {
      handleChangeVideo(0);
      setInitialized(true);
    }
  }, [initialized]);

  return (
    <>
      <Grid item xs={12} md={8}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            {lecture?.title}
          </Typography>
          <MUIRichTextEditor
            defaultValue={lecture?.content}
            toolbar={false}
            readOnly
          />
          <Box position="relative">
            <ReactPlayer
              url={url}
              width="100%"
              controls
              playing
              progressInterval={10_000}
              ref={playerRef}
            />
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} md={4}>
        <Paper variant="softoutline" sx={{ width: 1, height: 1 }}>
          <Typography variant="sectiontitle1" component="h3">
            学習内容
          </Typography>
          <List disablePadding>
            {lectures.map(({ title }, index) => (
              <ListItemButton
                selected={index === currentIndex}
                onClick={() => handleChangeVideo(index)}
                key={index}
              >
                <ListItemText
                  primary={`[${chapterNumber}-${index + 1}]`}
                  secondary={title}
                  primaryTypographyProps={{ fontWeight: "bold" }}
                />
                <PlayCircleOutline fontSize="large" color="primary" />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      </Grid>
    </>
  );
}

export default LecturePreview;

import Button from "@/components/atoms/Button";
import useChapter from "@/hooks/pages/Students/useChapter";
import { getTemporaryVideoUrl } from "@/services/AuthService";
import {
  getLectures,
  updateViewingInformation,
} from "@/services/LectureService";
import { VideoAttributes } from "@/validations/CourseFormValidation";
import { PlayCircleOutline, Redo, Replay } from "@mui/icons-material";
import {
  Box,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import MUIRichTextEditor from "mui-rte";
import { useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";

interface StudentLectureProps {}

function StudentLecture({}: StudentLectureProps) {
  const mounted = useRef(true);
  const playerRef = useRef<any>(null);
  const [initialized, setInitialized] = useState(false);
  const [initializedPlayer, setInitializedPlayer] = useState(false);
  const [lectures, setLectures] = useState<VideoAttributes[]>([]);
  const [url, setUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { chapterId } = useChapter();
  const [chapterNumber, setChapterNumber] = useState(1);

  const lecture = lectures[currentIndex];

  const handleProgress = (state: OnProgressProps) => {
    if (!lecture.is_complete && initializedPlayer) {
      console.log("progress");

      updateViewingInformation(
        lecture.id!,
        state.playedSeconds,
        state.played === 1
      );
      const temp = [...lectures];
      temp[currentIndex].playback_position = state.playedSeconds;
      temp[currentIndex].is_complete = state.played === 1;

      setLectures(temp);
    }
  };

  const handleInitialized = (position: number) => {
    playerRef.current.seekTo(position, "seconds");
    setInitializedPlayer(true);
  };

  const handleChangeVideo = (index: number) => {
    setCurrentIndex(index);
    setInitializedPlayer(false);
    (async () => {
      try {
        const res = await getTemporaryVideoUrl(lectures[index].video_file_path);
        setUrl(res.data.url);
        if (lectures[index].is_complete === null) setInitializedPlayer(true);
        else {
          setInitializedPlayer(
            !!lectures[index].is_complete ||
              lectures[index].playback_position === 0
          );
        }
      } catch (e: any) {}
    })();
  };

  useEffect(() => {
    mounted.current = true;

    (async () => {
      try {
        const res = await getLectures(chapterId!);
        setLectures(res.data.data);
        setChapterNumber(res.data.chapterNumber);

        const vidRes = await getTemporaryVideoUrl(
          res.data.data[0].video_file_path
        );
        setUrl(vidRes.data.url);
        if (res.data.data[0].is_complete === null) setInitializedPlayer(true);
        else {
          setInitializedPlayer(
            !!res.data.data[0].is_complete ||
              res.data.data[0].playback_position === 0
          );
        }
        setInitialized(true);
      } catch (e: any) {}
    })();

    return () => {
      mounted.current = false;
    };
  }, [chapterId, initialized]);

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
              controls={initializedPlayer}
              playing={initializedPlayer}
              onProgress={handleProgress}
              progressInterval={10_000}
              ref={playerRef}
            />
            {initialized && !initializedPlayer && (
              <Stack
                height={1}
                width={1}
                position="absolute"
                top={0}
                alignItems="center"
                justifyContent="center"
              >
                <Button
                  onClick={() => handleInitialized(0)}
                  startIcon={<Replay />}
                  fit
                >
                  Play from start
                </Button>
                <Button
                  onClick={() => handleInitialized(lecture?.playback_position!)}
                  startIcon={<Redo />}
                  fit
                >
                  Jump to {lecture?.playback_position?.toFixed(2)}s
                </Button>
              </Stack>
            )}
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

export default StudentLecture;

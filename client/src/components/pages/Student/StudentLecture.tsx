import Button from "@/components/atoms/Button";
import useChapter from "@/hooks/pages/Students/useChapter";
import useAlerter from "@/hooks/useAlerter";
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
import { useQuery } from "@tanstack/react-query";
import MUIRichTextEditor from "mui-rte";
import { useRef, useState } from "react";
import ReactPlayer from "react-player";
import { OnProgressProps } from "react-player/base";

function StudentLecture() {
  const playerRef = useRef<any>(null);
  const { errorSnackbar } = useAlerter();
  const [initializedPlayer, setInitializedPlayer] = useState(false);
  const [lectures, setLectures] = useState<VideoAttributes[]>([]);
  const [url, setUrl] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const { chapterId } = useChapter();
  const [chapterNumber, setChapterNumber] = useState(1);

  const { isFetching: lectureIsFetching } = useQuery(
    ["lecture-details", chapterId],
    () => getLectures(chapterId!),
    {
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        setLectures(res.data.data);
        setChapterNumber(res.data.chapterNumber);
      },
      onError: (e: any) => errorSnackbar(e.message),
    }
  );

  const { isFetching: urlIsFetching } = useQuery(
    ["temporary-url", lectures[0]?.video_file_path],
    () => getTemporaryVideoUrl(lectures[0].video_file_path),
    {
      enabled: !!lectures[0]?.video_file_path,
      refetchOnWindowFocus: false,
      onSuccess: (res) => {
        setUrl(res.data.url);
        if (!lectures[0].is_complete) setInitializedPlayer(true);
        else {
          setInitializedPlayer(
            !!lectures[0].is_complete || lectures[0].playback_position === 0
          );
        }
      },
    }
  );

  const lecture = lectures[currentIndex];

  const handleProgress = (state?: OnProgressProps) => {
    if (!lecture.is_complete && initializedPlayer) {
      console.log("progress");

      const playedSeconds =
        state?.playedSeconds ?? playerRef.current.getDuration();
      const completed = state ? state.played === 1 : true;

      updateViewingInformation(lecture.id!, playedSeconds, completed);
      const temp = [...lectures];
      temp[currentIndex].playback_position = playedSeconds;
      temp[currentIndex].is_complete = completed;

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
              onEnded={handleProgress}
              progressInterval={10_000}
              ref={playerRef}
            />
            {lectureIsFetching && urlIsFetching && !initializedPlayer && (
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

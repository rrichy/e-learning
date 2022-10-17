import useChapter from "@/hooks/pages/Students/useChapter";
import { getLectures } from "@/services/LectureService";
import React, { useEffect, useRef } from "react";

interface StudentLectureProps {}

function StudentLecture({}: StudentLectureProps) {
  const mounted = useRef(true);
  const { chapterId } = useChapter();

  useEffect(() => {
    mounted.current = true;

    (async () => {
      try {
        const res = await getLectures(chapterId!);
        console.log(res.data);
      } catch (e: any) {
        
      }
    })();
    
    return () => {
      mounted.current = false;
    }
  }, [chapterId]);

  return (
    <div>StudentLecture</div>
  )
}

export default StudentLecture
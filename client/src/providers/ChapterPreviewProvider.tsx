import { ChapterContextAttribute } from "@/hooks/pages/Students/useChapter";
import React, { createContext } from "react";

export const ChapterPreviewContext = createContext<
  Partial<ChapterContextAttribute>
>({});

function ChapterPreviewProvider({
  children,
  context,
}: {
  context: Partial<ChapterContextAttribute>;
  children: React.ReactNode;
}) {
  return (
    <ChapterPreviewContext.Provider value={context}>
      {children}
    </ChapterPreviewContext.Provider>
  );
}

export default ChapterPreviewProvider;

"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { EditorState, convertFromRaw, convertToRaw } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"; // 스타일 임포트

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false },
);

export default function DraftEditor({ setContent, alreadyEditorState }: any) {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    if (alreadyEditorState) {
      const contentState = convertFromRaw(JSON.parse(alreadyEditorState));
      const newEditorState = EditorState.createWithContent(contentState);
      setEditorState(newEditorState);
    }
  }, [alreadyEditorState]);

  const handleEditorChange = (state: EditorState) => {
    setEditorState(state);
    const contentState = state.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const rawContentStateJson = JSON.stringify(rawContentState);
    setContent(rawContentStateJson);
  };
  return (
    <div className="rounded  bg-white p-2 dark:bg-dark-dark">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleEditorChange}
        toolbar={{
          options: [
            "inline",
            "blockType",
            "fontSize",
            "list",
            "textAlign",
            "link",
            "history",
            "fontFamily",
          ],
          inline: { inDropdown: false },
          list: { inDropdown: false },
          textAlign: { inDropdown: true },
          link: { inDropdown: false },
          history: { inDropdown: false },
        }}
        localization={{
          locale: "ko",
        }}
        placeholder="내용을 입력하세요..."
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
      />
    </div>
  );
}

import Editor from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import React, { useEffect, useRef } from "react";
import styled from "styled-components";

type PreviewProps = {
  content: string;
};

const EDITOR_FONT_SIZE = 16;
const EDITOR_LINE_HEIGHT = 24;
const EDITOR_PADDING = 5;

const EDITOT_DEFAULT_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
  scrollBeyondLastLine: false,
  lineNumbers: "off",
  glyphMargin: false,
  fontLigatures: true,
  tabSize: 2,
  folding: false,
  minimap: { enabled: false },
  lineHeight: EDITOR_LINE_HEIGHT,
  fontSize: EDITOR_FONT_SIZE,
  padding: {
    bottom: EDITOR_PADDING,
    top: EDITOR_PADDING,
  },
  readOnly: true,
  automaticLayout: true,
};

export function Preview({ content }: PreviewProps): JSX.Element | null {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      const model = editor.getModel();
      if (model) {
        model.setValue(content);
      }
    }
  }, [content]);

  return (
    <Wrapper>
      <Editor
        theme="vs-dark"
        options={{
          ...EDITOT_DEFAULT_OPTIONS,
        }}
        defaultLanguage="sql"
        defaultValue={content}
        onMount={(editor) => {
          editorRef.current = editor;
        }}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div({
  height: "100%",
  width: "100%",
});

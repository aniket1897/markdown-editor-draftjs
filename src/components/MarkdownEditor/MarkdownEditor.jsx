import React, { useState } from "react";
import {
  Editor,
  EditorState,
  getDefaultKeyBinding,
  RichUtils,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";
import "./MarkdownEditor.css";
import { getInitEditorState, saveEditorState } from "../../utils/util";
import { styleMap } from "../../utils/constants";

function MarkdownEditor(props) {
  const [editorContents, setEditorContents] = useState(() =>
    getInitEditorState()
  );

  const getEditorBlock = (editorState) => {
    const selection = editorState.getSelection();
    const blockKey = selection.getStartKey();
    const content = editorState.getCurrentContent();
    const block = content.getBlockForKey(blockKey);
    return block;
  };

  const getCurrentLine = (editorState) => {
    return getEditorBlock(editorState).getText();
  };

  function getUpdatedEditorState(editorState) {
    const selection = editorState.getSelection();
    const block = getEditorBlock(editorState);
    const blockLength = block.getLength();
    const contentState = editorState.getCurrentContent();
    // Replace the block's content with an empty string
    const newContentState = Modifier.replaceText(
      contentState,
      selection.merge({
        anchorOffset: 0,
        focusOffset: blockLength,
      }),
      ""
    );
    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "insert-characters"
    );
    return newEditorState;
  }

  const getMarkdownState = (state, line) => {
    let markdownState = null;
    switch (line) {
      case "#": {
        markdownState = RichUtils.toggleBlockType(state, "header-one");
        break;
      }
      case "*": {
        markdownState = RichUtils.toggleInlineStyle(state, "BOLD");
        break;
      }
      case "**": {
        markdownState = RichUtils.toggleInlineStyle(state, "double-stars");
        break;
      }
      case "***": {
        markdownState = RichUtils.toggleInlineStyle(state, "UNDERLINE");
        break;
      }
      default:
        break;
    }
    return markdownState;
  };

  const keyBindingFunction = (e) => {
    if (e.code == "Space") {
      const editorState = editorContents;
      const line = getCurrentLine(editorState);
      const formattedLineState = getUpdatedEditorState(editorState);
      const markdownState = getMarkdownState(formattedLineState, line);
      if (markdownState) {
        setEditorContents(markdownState);
        return "handled";
      }
    }
    return getDefaultKeyBinding(e);
  };

  const handleKeyCommand = (command, editorState) => {
    const newEditorState = RichUtils.handleKeyCommand(editorState, command);
    if (newEditorState) {
      setEditorContents(newEditorState);
      return "handled";
    }
    return "not-handled";
  };

  const handleSaveClick = () => {
    saveEditorState(editorContents);
  };

  return (
    <div id="editor-container">
      <div id="title-container">
        <div id="title">Markdown Editor</div>
        <div>
          <button onClick={handleSaveClick}>Save</button>
        </div>
      </div>
      <div id="editor">
        <Editor
          editorState={editorContents}
          onChange={setEditorContents}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={keyBindingFunction}
          customStyleMap={styleMap}
        />
      </div>
    </div>
  );
}

export default MarkdownEditor;

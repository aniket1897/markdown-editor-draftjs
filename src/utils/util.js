import { convertToRaw, convertFromRaw, EditorState } from "draft-js";
import { STORAGE_KEY } from "./constants";

export function saveEditorState(state) {
  const contentState = state.getCurrentContent();
  const op = convertToRaw(contentState);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(op));
}

export function getInitEditorState() {
  const savedData = localStorage.getItem(STORAGE_KEY);
  if (savedData) {
    const rawData = JSON.parse(savedData);
    const contentState = convertFromRaw(rawData);
    return EditorState.createWithContent(contentState);
  }
  return EditorState.createEmpty();
}

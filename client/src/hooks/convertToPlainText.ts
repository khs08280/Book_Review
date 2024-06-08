import { convertFromRaw } from "draft-js";

export const convertJsonToText = (rawContentStateJson: string) => {
  const rawContentState = JSON.parse(rawContentStateJson);

  const contentState = convertFromRaw(rawContentState);

  const plainText = contentState.getPlainText();

  return plainText;
};

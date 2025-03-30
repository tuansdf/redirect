import { base64urlnopad } from "@scure/base";
import Pako from "pako";

export const compressText = (contentStr: string): string => {
  try {
    return base64urlnopad.encode(Pako.deflate(contentStr));
  } catch (e) {
    return "";
  }
};

export const decompressText = (content64: string): string => {
  try {
    return Pako.inflate(base64urlnopad.decode(content64), { to: "string" });
  } catch (e) {
    return "";
  }
};

import { base64urlnopad } from "@scure/base";
import { compressToUint8Array, decompressFromUint8Array } from "lz-string";

export const compressText = (contentStr: string): string => {
  try {
    return base64urlnopad.encode(compressToUint8Array(contentStr));
  } catch (e) {
    return "";
  }
};

export const decompressText = (content64: string): string => {
  try {
    return decompressFromUint8Array(base64urlnopad.decode(content64));
  } catch (e) {
    return "";
  }
};

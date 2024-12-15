import { xchacha20poly1305 } from "@noble/ciphers/chacha";
import { bytesToHex, hexToBytes } from "@noble/ciphers/utils";
import { managedNonce, randomBytes } from "@noble/ciphers/webcrypto";
import { base64urlnopad } from "@scure/base";
import Pako from "pako";

export const encryptText = (contentStr: string, passwordHex: string): string => {
  try {
    const password = hexToBytes(passwordHex);
    const cipher = managedNonce(xchacha20poly1305)(password);
    let content = Pako.deflate(contentStr);
    let encrypted = cipher.encrypt(content);
    return base64urlnopad.encode(encrypted);
  } catch (e) {
    return "";
  }
};

export const decryptText = (content64: string, passwordHex: string): string => {
  try {
    const content = base64urlnopad.decode(content64);
    const password = hexToBytes(passwordHex);
    const cipher = managedNonce(xchacha20poly1305)(password);
    return Pako.inflate(cipher.decrypt(content), { to: "string" });
  } catch (e) {
    return "";
  }
};

export const generatePassword = (size: number = 32) => {
  return bytesToHex(randomBytes(size));
};

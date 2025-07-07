// src/common/utils/crypto.util.ts
import * as CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.CRYPTO_SECRET || 'default_secret';

export const encrypt = (data: any): string => {
  const strData = typeof data === 'string' ? data : JSON.stringify(data);
  return CryptoJS.AES.encrypt(strData, SECRET_KEY).toString();
};

export const decrypt = (cipherText: string): any => {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);

  try {
    return JSON.parse(decrypted);
  } catch {
    return decrypted;
  }
};

const crypto = require("crypto");
const algorithm = "aes-256-cbc";

const generateKey = () => {
  const key = crypto.randomBytes(32); //AES key
  const iv = crypto.randomBytes(16); //initialisation vector

  const keyObj = {
    key: key.toString("hex"),
    iv: iv.toString("hex"),
  };
  // stringify the key to store in DB
  const keyObjStr = JSON.stringify(keyObj);
  return keyObjStr;
};

const encryptData = ({ keyObjStr = " ", dataStr = " " }) => {
  //Extract key and iv from keyObjString
  const keyObj = JSON.parse(keyObjStr);
  const { key, iv } = keyObj;

  //Encrypt the text
  let cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let encrypted = cipher.update(dataStr);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const encryptedStr = encrypted.toString("hex");

  //Return stringified encryptedData
  return encryptedStr;
};

const decryptData = ({ keyObjStr = "abc", encryptedStr = " " }) => {
  //Extract key and iv from keyObjString
  // console.log(keyObjStr);
  const keyObj = JSON.parse(keyObjStr);
  const { key, iv } = keyObj;

  //Decrypt the encryptedString
  let encryptedText = Buffer.from(encryptedStr, "hex");
  let decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, "hex"),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  const decryptedStr = decrypted.toString();

  //Return stringified decryptedData
  return decryptedStr;
};

module.exports = {
  generateKey,
  encryptData,
  decryptData,
};

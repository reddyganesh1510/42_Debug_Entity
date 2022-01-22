const crypto = require("crypto");

const getKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  });
  return { publicKey, privateKey };
};

const encryptData = ({ publicKey = "", data = "" }) => {
  const encryptedData = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    // We convert the data string to a buffer using `Buffer.from`
    Buffer.from(data)
  );
  return encryptedData.toString("base64");
};

const decryptData = ({ privateKey = "", data = "" }) => {
  const decryptedData = crypto.privateDecrypt(
    {
      key: privateKey,
      // In order to decrypt the data, we need to specify the
      // same hashing function and padding scheme that we used to
      // encrypt the data in the previous step
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedData
  );
  return decryptedData.toString();
};

module.exports = {
  getKeys,
  encryptData,
  decryptData,
};

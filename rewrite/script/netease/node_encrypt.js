const crypto = require("crypto");

const eapiKey = Buffer.from("e82ckenh8dichen8");
const base62 = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

// AES-128-ECB 加密函数
const aesEncryptECB = (buffer, key) => {
  const cipher = crypto.createCipheriv("AES-128-ECB", key, null);
  return Buffer.concat([cipher.update(buffer), cipher.final()]);
};

// 逆向加密函数，将 JSON 数据加密回去
const encryptJsonWithEapiKey = (jsonObject) => {
  try {
    const text = JSON.stringify(jsonObject);
    const encryptedData = aesEncryptECB(Buffer.from(text), eapiKey)
      .toString("hex")
      .toUpperCase();
    return encryptedData;
  } catch (error) {
    console.error("加密失败:", error.message);
    return null;
  }
};

// 测试用例：将 JSON 对象加密回去
const originalJson = {
  username: "example_user",
  password: "example_password",
};

const encryptedData = encryptJsonWithEapiKey(originalJson);
console.log("加密后的数据:", encryptedData);

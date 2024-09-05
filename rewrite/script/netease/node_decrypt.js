const crypto = require("crypto");

// 给定的密钥和 IV
const iv = Buffer.from("0102030405060708");
const presetKey = Buffer.from("0CoJUm6Qyw8W8jud");
const eapiKey = Buffer.from("e82ckenh8dichen8");
const linuxapiKey = Buffer.from("rFgB&h#%2?^eDg:Q");

// 给定的加密数据 (HEX 格式)
const encryptedData =
  "4dc12a14eca8f30f33123e619c7b9c898a63ec001a2097d78ca57d3976f3779c6eee2d85b68aac7c9fe0b5317b093dbbb16624a76f0e1932ee0af8214bbfc18b391c57fdc52bd22ea0b97de86090300376bad750ae2cf9098f6181e94b531fdc73b4f9ae93ad447b53b4dd8fe28f713e502502b110e2e3af4fd5d66e7b754fbe7b2983e6cd307b5ba0fd2d84580fe4027e18c84d76dcca2d67253cb1981a945e251707dbbedcd1f602fca32a969f424b07a1f3f5cb1e706f9a419f6f4814aef01fa153335622d3d1f322aec60cb2e66cfc3498d7925734c8e34d220bff7adaf7";

  // '{"code":200,"message":"成功","data":[{"expName":"SearchHotlistsubtitle","expGroupName":"t1","status":0,"clientConfig":{},"expInfo":{"t1":"1.0"},"log":null,"flowHashId":"userId","createTimestamp":"1716450134"}]}'
  
// AES-128-CBC 解密函数
const aesDecryptCBC = (buffer, key, iv) => {
  const decipher = crypto.createDecipheriv("AES-128-CBC", key, iv);
  return Buffer.concat([decipher.update(buffer), decipher.final()]);
};

// AES-128-ECB 解密函数
const aesDecryptECB = (buffer, key) => {
  const decipher = crypto.createDecipheriv("AES-128-ECB", key, null);
  return Buffer.concat([decipher.update(buffer), decipher.final()]);
};

// 尝试解密方法
try {
  // 尝试使用 presetKey 和 IV 进行 AES-128-CBC 解密
  const bufferData = Buffer.from(encryptedData, "hex");
  const decryptedDataCBC = aesDecryptCBC(bufferData, presetKey, iv);
  console.log("CBC 解密后的数据:", decryptedDataCBC.toString("utf8"));
} catch (error) {
  console.error("CBC 解密出错:", error.message);
}

try {
  // 尝试使用 eapiKey 进行 AES-128-ECB 解密
  const bufferData = Buffer.from(encryptedData, "hex");
  const decryptedDataECB = aesDecryptECB(bufferData, eapiKey);
  console.log("ECB 解密后的数据 (eapiKey):", decryptedDataECB.toString("utf8"));
} catch (error) {
  console.error("ECB 解密出错 (eapiKey):", error.message);
}

try {
  // 尝试使用 linuxapiKey 进行 AES-128-ECB 解密
  const bufferData = Buffer.from(encryptedData, "hex");
  const decryptedDataECB = aesDecryptECB(bufferData, linuxapiKey);
  console.log(
    "ECB 解密后的数据 (linuxapiKey):",
    decryptedDataECB.toString("utf8")
  );
} catch (error) {
  console.error("ECB 解密出错 (linuxapiKey):", error.message);
}

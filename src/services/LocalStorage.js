import CryptoJS from 'crypto-js';

const secretKey = 'hjhfi567#HGGUY&^^*^GHVUYGIfuyqqyd8d7y1';

const encryptData = (data) => {
  try {
    const cipherText = CryptoJS.AES.encrypt(data, secretKey).toString();
    return cipherText;
  } catch (error) {
    console.error('Error encrypting data:', error);
    return null;
  }
};

const decryptData = (cipherText) => {
  try {
    const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
    const originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
  } catch (error) {
    console.error('Error decrypting data:', error);
    return null;
  }
};

const storeToken = (token) => {
  const encryptedToken = encryptData(token);
  if (encryptedToken) {
    localStorage.setItem('token', encryptedToken);
  }
};

const getToken = () => {
  const encryptedToken = localStorage.getItem('token');
  if (!encryptedToken) return null;
  return decryptData(encryptedToken);
};

const removeToken = () => {
  localStorage.removeItem('token');
};

const storeAuthId = (authid) => {
  const encryptedAuthId = encryptData(authid);
  if (encryptedAuthId) {
    localStorage.setItem('authid', encryptedAuthId);
  }
};

const getAuthId = () => {
  const encryptedAuthId = localStorage.getItem('authid');
  if (!encryptedAuthId) return null;
  return decryptData(encryptedAuthId);
};

const removeAuthId = () => {
  localStorage.removeItem('authid');
};

const storeTempUserDetails = (actualData) => {
  const encryptedData = encryptData(JSON.stringify(actualData));
  if (encryptedData) {
    localStorage.setItem('actualData', encryptedData);
  }
};

const getTempUserDetails = () => {
  const encryptedData = localStorage.getItem('actualData');
  if (!encryptedData) return null;
  const decryptedData = decryptData(encryptedData);
  if (decryptedData) {
    return JSON.parse(decryptedData);
  }
  return null;
};

const removeTempUserDetails = () => {
  localStorage.removeItem('actualData');
};

export { storeToken, getToken, removeToken, storeAuthId, getAuthId, removeAuthId, storeTempUserDetails, getTempUserDetails, removeTempUserDetails };

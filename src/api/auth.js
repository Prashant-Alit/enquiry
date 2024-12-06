import axios from 'axios';
import defaultUser from '../utils/default-user';


export async function signIn(UserName, password) {
  try {
    const baseURL = process.env.REACT_APP_BASE_URL;
    const response = await axios.post(`${baseURL}/Authenticate/Post`, {
      UserName,
      password,
    });
    return {
      isOk: true,
      data: response, 
    };
  } catch (error) {
    console.error("Authentication error:", error.response || error.message);
    return {
      isOk: false,
      message: error.response?.data?.message || "Authentication failed",
    };
  }
}

export async function createAccount(email, password) {
  try {
    console.log(email, password);
    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to create account"
    };
  }
}

export async function changePassword(email, recoveryCode) {
  try {
    console.log(email, recoveryCode);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to change password"
    }
  }
}

export async function resetPassword(email) {
  try {
    console.log(email);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to reset password"
    };
  }
}

import axios from 'axios';
import defaultUser from '../utils/default-user';
// export async function signIn(email, password) {
//   try {
//     // Send request
//     console.log("data from auth js",email, password);

//     return {
//       isOk: true,
//       data: defaultUser
//     };
//   }
//   catch {
//     return {
//       isOk: false,
//       message: "Authentication failed"
//     };
//   }
// }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export async function signIn(UserName, password) {
  try {
    console.log("Data from auth.js:", UserName, password);
    const response = await axios.post('https://localhost:7137/api/Authenticate/Post', {
      UserName,
      password,
    });
    console.log("API Responsesssss:", response);
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// export async function getUser() {
//   try {
//     // Send request

//     return {
//       isOk: true,
//       data: defaultUser
//     };
//   }
//   catch {
//     return {
//       isOk: false
//     };
//   }
// }

export async function createAccount(email, password) {
  try {
    // Send request
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
    // Send request
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
    // Send request
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

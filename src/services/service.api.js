import axios from "axios";

export async function signIn(email, password) {
    try {
      console.log("Data from auth.js:", email, password);
      const response = await axios.post('https://localhost:7137/api/Authenticate/Post', {
        email,
        password,
      });
      console.log("API Response:", response);
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

  
export async function getSpecialityData() {
  try {
    // console.log("Data from auth.js:", email, password);
    const response = await axios.get('https://localhost:7137/api/Speciality/GetList')
    console.log("API Response:", response);
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
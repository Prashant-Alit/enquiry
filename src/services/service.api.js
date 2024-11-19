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
    const response = await axios.get('https://localhost:7137/api/Speciality/GetList', {
      headers: {
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MzIxMDI5NDYsImlzcyI6IkVucXVpcnkifQ.nO9SOoWID_wqEcwwKUGlEwgzEyUvadwkY528xVYqW_Q"}`, // Include the token in the Authorization header
      },
    });
    console.log("API Responseddddd:", response?.data);
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
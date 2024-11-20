import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
  
export async function getSpecialityData() {
  try {
     
    const response = await axios.get(`${baseURL}/Speciality/GetList`, {
      headers: {
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MzIxODUzMTQsImlzcyI6IkVucXVpcnkifQ.yjkWIb7Eh8vSbdpJZPJOd9h6onfX5UQcahQ1Km9WE7E"}`, // Include the token in the Authorization header
      },
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

export async function getDoctorListData() {
  try {
    const response = await axios.get(`${baseURL}/Doctor/GetList`, {
      headers: {
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MzIxODUzMTQsImlzcyI6IkVucXVpcnkifQ.yjkWIb7Eh8vSbdpJZPJOd9h6onfX5UQcahQ1Km9WE7E"}`, // Include the token in the Authorization header
      },
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

export async function getAppointmentData () {
   try {
    const response = await axios.get(`${baseURL}/Patient/GetList`, {
      headers: {
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MzIxODUzMTQsImlzcyI6IkVucXVpcnkifQ.yjkWIb7Eh8vSbdpJZPJOd9h6onfX5UQcahQ1Km9WE7E"}`, // Include the token in the Authorization header
      },
    });
    return {
      isOk: true,
      data: response, 
    };
   } catch (error){
    console.error("Authentication error:", error.response || error.message);
    return {
      isOk: false,
      message: error.response?.data?.message || "Authentication failed",
    };
   }
}

export async function getReceiptListData () {
  try{
    const response = await axios.get(`${baseURL}/Receipt/GetList`,{
      headers: {
        Authorization: `Bearer ${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MzIxODUzMTQsImlzcyI6IkVucXVpcnkifQ.yjkWIb7Eh8vSbdpJZPJOd9h6onfX5UQcahQ1Km9WE7E"}`, // Include the token in the Authorization header
      },
    })
    return{
      isOk: true,
      data: response, 
  }
  } catch (error){
    console.log("error",error)
  }
}
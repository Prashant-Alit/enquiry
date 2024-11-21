import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MzIyNjA5MjQsImlzcyI6IkVucXVpcnkifQ.bXPD_KND_12Bz1v-j4MKR1_mX6UDZKpUbngTqs--2fY"; 

async function apiGet(endpoint) {
  try {
    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("response",response)
    return {
      isOk: true,
      data: response, 
    };
  } catch (error) {
    // console.error("API error:", error.response || error.message);
    console.log("API error: ",error.message || error.response)
    return {
      isOk: false,
      message: error.response?.data?.message || "Request failed",
    };
  }
}

async function apiPost (endpoint,bodyObject) {
  try {
    const response = await axios.post(`${baseURL}${endpoint}`, bodyObject, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      isOk:true,
      data:response
    }
  } catch (error){
    console.log("API error: ",error.message || error.response)
    return {
      isOk : false,
      message:error.response?.data?.message
    }
  }
}

async function apiPut(endpoint, bodyObject) {
  try {
    const response = await axios.put(`${baseURL}${endpoint}`, bodyObject, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      isOk: true,
      data: response,
    };
  } catch (error) {
    console.error("API error: ", error.message || error.response);
    return {
      isOk: false,
      message: error.response?.data?.message || "Request failed",
    };
  }
}

 async function apiDelete(endpoint) {
  try {
    const response = await axios.delete(`${baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      isOk: true,
      data: response,
    };
  } catch (error) {
    console.error("API error: ", error.message || error.response);
    return {
      isOk: false,
      message: error.response?.data?.message || "Request failed",
    };
  }
}

// async function apiDoctorDelete(endpoint) {
//   try {
//     const response = await axios.delete(`${baseURL}${endpoint}`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     return {
//       isOk: true,
//       data: response,
//     };
//   } catch (error) {
//     console.error("API error: ", error.message || error.response);
//     return {
//       isOk: false,
//       message: error.response?.data?.message || "Request failed",
//     };
//   }
// }


export async function deleteFromList (idValue) {
  return await  apiDelete(`/Speciality/Delete/${idValue}`)
}

export async function deleteFromDoctorList (idValue) {
  return await apiDelete(`/Doctor/Delete/${idValue}`)
}

export async function addDoctorListData(formdata) {
  return await apiPost("/Doctor/Insert",formdata)
}


export async function addSpecialityData(formdata){
  return await apiPost("/Speciality/Insert",formdata)
}

export async function editSpecialityData(formdata){
  return await apiPut("/Speciality/Update",formdata)
}

export async function editDoctorListData(formdata) {
  return await apiPut("/Doctor/Update",formdata)
}

export async function getSpecialityData() {
  return await apiGet("/Speciality/GetList")
}

export async function getDoctorListData() {
  return await apiGet("/Doctor/GetList");
}

export async function getAppointmentData() {
  return await apiGet("/Patient/GetList");
}

export async function getReceiptListData() {
  return await apiGet("/Receipt/GetList");
}

export async function doctorSpecialtyID(){
  return await apiGet("/Doctor/GetLookupList")
}
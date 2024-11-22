import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEiLCJleHAiOjE3MzIzNDU4NDIsImlzcyI6IkVucXVpcnkifQ.ylvzRkxtWxBmmIti5Ew8JcLuWLG6GzavmZwvI74MN_Q"; 

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

export async function deletefromAppointmentList (idValue){
  return await apiDelete(`/Patient/Delete/${idValue}`)
}

export async function addDoctorListData(formdata) {
  return await apiPost("/Doctor/Insert",formdata)
}


export async function addSpecialityData(formdata){
  return await apiPost("/Speciality/Insert",formdata)
}

export async function addAppointmentData(formdata){
  return await apiPost("/Patient/Insert",formdata)
}

export async function editSpecialityData(formdata){
  return await apiPut("/Speciality/Update",formdata)
}

export async function editDoctorListData(formdata) {
  return await apiPut("/Doctor/Update",formdata)
}

export async function editAppointmentData(formdata) {
  return await apiPut("/Patient/Update",formdata);
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

export async function getStateData() {
  const response = await apiGet("/State/GetLookupList");
  console.log("apapapiiiiii",response?.data?.data)
 if (response.isOk) {
     return response?.data?.data;
   } else {
     console.error("Failed to fetch state data:", response.message);
     return [];
   }
}

export async function getCityData() {
  const response = await apiGet("/City/GetLookupList");
  if (response.isOk) {
    return response.data.data.map((item) => ({
      CityID: item.CityID,
      CityName: item.CityName,
      StateID: item.StateID
    }));
  } else {
    console.error("Failed to fetch city data:", response.message);
    return [];
  }
}

export async function getDoctorData() {
  return await apiGet("/Doctor/GetLookupList");
}

export async function getSpecialityData2() {
   return await apiGet("/Speciality/GetLookupList");
}

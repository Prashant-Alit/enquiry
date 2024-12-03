import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

async function apiGet(endpoint) {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${baseURL}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return {
      isOk: true,
      data: response, 
    };
  } catch (error) {
    console.log("API error: ",error.message || error.response)
    return {
      isOk: false,
      message: error.response?.data?.message || "Request failed",
    };
  }
}

async function apiPost (endpoint,bodyObject) {
  const token = localStorage.getItem("token");
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
  const token = localStorage.getItem("token");
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
  const token = localStorage.getItem("token");
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

export async function deleteFromList (idValue) {
  return await  apiDelete(`/Speciality/Delete/${idValue}`)
}

export async function deleteItem(idValue){
  return await apiDelete(`/Item/Delete/${idValue}`)
}

export async function deleteFromReceiptList (idValue) {
  return await apiDelete(`/Receipt/Delete/${idValue}`)
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

export async function addReceiptData(formdata){
  return await apiPost("/Receipt/Insert",formdata)
}

export async function addSpecialityData(formdata){
  return await apiPost("/Speciality/Insert",formdata)
}

export async function addItemData(formdata){
  return await apiPost("/Item/Insert",formdata)
}

export async function addAppointmentData(formdata){
  return await apiPost("/Patient/Insert",formdata)
}

export async function editSpecialityData(formdata){
  return await apiPut("/Speciality/Update",formdata)
}

export async function editItemData(formdata) {
  return await apiPut("/Item/Update",formdata)
}

export async function editDoctorListData(formdata) {
  return await apiPut("/Doctor/Update",formdata)
}

export async function  editReceiptData(formdata) {
  return await apiPut("/Receipt/Update",formdata)
}

export async function editAppointmentData(formdata) {
  console.log("service formdata",formdata)
  return await apiPut("/Patient/Update",formdata);
}

export async function getSpecialityData() {
  return await apiGet("/Speciality/GetList");
}

export async function getItemData() {
  return await apiGet("/Item/GetList");
}

export async function getDoctorListData() {
  return await apiGet("/Doctor/GetList");
}

export async function getReceiptListDataByID(idValue){
  return await apiGet(`/Receipt/GetById/${idValue}`)
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

export async function getItemListData(){
  return await apiGet("/Item/GetLookupList");
}

export async function getDoctorListBySpeciality(idvalue) {
   return await apiGet(`/Doctor/GetListBySpeciality/${idvalue}`)
}
export async function getSpecialityData2() {
   return await apiGet("/Speciality/GetLookupList");
}

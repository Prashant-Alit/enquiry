
import React, { useEffect, useState } from "react";
import DataGrid, { Column, Paging } from "devextreme-react/data-grid";
import { Button } from "devextreme-react";
import { getSpecialityData } from "../../services/service.api";
import CustomPopup from "../../components/popup/CustomPopup"; // Import the reusable popup
import "./specialty.style.scss";

export default function Speciality() {
  const [specialityList, setSpecialityList] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const getlist = await getSpecialityData();
      if (getlist) {
        setSpecialityList(getlist?.data?.data);
      }
    };
    fetchData();
  }, []);

  const handleEdit = (data) => {
    setFormData(data);
    setIsPopupVisible(true);
  };

  const handleClose = () => {
    setIsPopupVisible(false);
    setFormData({});
  };

  const handleSave = async () => {
    console.log("Saving updated data:", formData);
    // try {
    //   await editSpecialityData(formData);
    //   const updatedList = await getSpecialityData();
    //   setSpecialityList(updatedList?.data?.data || []);
    //   handleClose(); // Close popup after saving
    // } catch (error) {
    //   console.error("Error updating speciality:", error);
    // }
  };

  const handleInputChange = (e) => {
    // const { name, value } = e.target;
    // setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <div className="header-container">
        <div>
          <h2>Specialty List</h2>
        </div>
        <div className="btn-container">
          <Button className="btn1" onClick={() => console.log("Print clicked")}>
            Print
          </Button>
          <Button className="btn1" onClick={() => console.log("Print clicked")}>
            ADD
          </Button>
        </div>
      </div>

      <div id="data-grid-demo">
        <DataGrid dataSource={specialityList} showBorders={true}>
          <Paging enabled={true} />
          <Column dataField="SpecialityID" />
          <Column dataField="SpecialityName" />
          <Column dataField="Description" />
          <Column
            caption="Actions"
            cellRender={({ data }) => (
              <div className="action-buttons">
                <Button
                  icon="edit"
                  onClick={() => handleEdit(data)}
                  className="action-button"
                />
                <Button
                  icon="trash"
                  onClick={() => console.log("Delete clicked for", data)}
                  className="action-button"
                />
              </div>
            )}
          />
        </DataGrid>
      </div>

      <CustomPopup
        visible={isPopupVisible}
        title="Specialty"
        formData={formData}
        onSave={handleSave}
        onClose={handleClose}
        onInputChange={handleInputChange}
        onValuechanged={handleInputChange}
      />
    </div>
  );
}


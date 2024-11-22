import { Button, DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { getReceiptListData } from "../../services/service.api";
import CustomPopup from "../../components/popup/CustomPopup";

export default function Receipt() {
  const [receiptList, setRecciptList] = useState();
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const receiptFields = [
    { dataField: "ReceiptNo", label: "ReceiptNo" },
    { dataField: "Quantity", label: "Quantity" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const listdata = await getReceiptListData();
      setRecciptList(listdata?.data?.data);
    };
    fetchData();
  }, []);

  const handleEdit = (data) => {
    // setFormData(data);
    setIsPopupVisible(true);
  };

  const handleClose = () => {
    setIsPopupVisible(false);
    // setFormData({});
  };

  return (
    <div>
      <div className="header-container">
        <div>
          <h2>Receipt List</h2>
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
      <div>
        <DataGrid dataSource={receiptList}>
          <Column dataField="ReceiptNo"></Column>
          <Column dataField="ReceiptDate"></Column>
          <Column dataField="NetAmount"></Column>
          <Column dataField=""></Column>
          <Column dataField=""></Column>
          <Column dataField=""></Column>
          <Column dataField=""></Column>
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
        title="Receipt"
        fields={receiptFields}
        // formData={formData}
        // onSave={handleSave}
        onClose={handleClose}
        // onInputChange={handleInputChange}
        // onValuechanged={handleInputChange}
      />
    </div>
  );
}

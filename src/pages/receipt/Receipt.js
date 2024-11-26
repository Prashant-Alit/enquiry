import { Button, DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import {
  deleteFromReceiptList,
  getReceiptListData,
  getReceiptListDataByID,
  saveReceiptData,
} from "../../services/service.api";
import notify from "devextreme/ui/notify";
import { exportDataGrid } from "devextreme/pdf_exporter";
import { jsPDF } from "jspdf";
import ReceiptPopup from "../../components/receiptpopup/ReceiptPopup";

export default function Receipt() {
  const [receiptList, setReceiptList] = useState([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [formData, setFormData] = useState(null);
  const [items, setItems] = useState([]);
  const [dataGridRef, setDataGridRef] = useState(null);
  const [recordCount, setRecordCount] = useState(0);

  const handleContentReady = (e) => {
    setRecordCount(e.component.totalCount()); 
  };

  useEffect(() => {
    const fetchData = async () => {
      const listData = await getReceiptListData();
      console.log("list data receipt", listData?.data?.data);
      setReceiptList(listData?.data?.data || []);
    };
    fetchData();
  }, []);

  const handleAdd = () => {
    const newReceiptNo = Math.floor(100000 + Math.random() * 900000);
    setFormData({
      ReceiptNo: newReceiptNo,
      ReceiptDate: new Date().toISOString().slice(0, 10),
      personName: "",
      Remarks: "",
      items: [],
    });
    setIsPopupVisible(true);
  };

  const handleEdit = async (data) => {
    try {
      const receiptData = await getReceiptListDataByID(data.ReceiptID);
      setFormData(receiptData?.data || {});
      setItems(receiptData?.data.data.ReceiptDetail || []);
      setIsPopupVisible(true);
    } catch (error) {
      notify("Failed to fetch receipt details", "error", 3000);
    }
  };

  const handleSave = async (data) => {
    console.log("hhhhhhhhhhh", data);
    try {
      const response = await saveReceiptData(data);
      if (response.isOk) {
        notify(
          data.receiptID
            ? "Receipt updated successfully!"
            : "Receipt added successfully!",
          "success",
          3000
        );

        
        const updatedList = await getReceiptListData();
        setReceiptList(updatedList?.data?.data || []);
        setIsPopupVisible(false);
      } else {
        throw new Error(response.message || "Failed to save receipt.");
      }
    } catch (error) {
      notify(error.message || "An unexpected error occurred.", "error", 3000);
    }
  };

  const handleDelete = async (receiptNo) => {
    console.log("PPPPPPPPPP", receiptNo?.ReceiptID);
    const response = await deleteFromReceiptList(receiptNo?.ReceiptID);
    if (response.isOk) {
      notify("Specialty deleted successfully!", "success", 3000);
      const listData = await getReceiptListData();
      console.log("lioooo", listData?.data?.data);
      setReceiptList(listData?.data?.data || []);
    } else {
      notify(response.message || "Failed to delete specialty", "error", 3000);
    }
  };

  const handleClose = () => {
    setIsPopupVisible(false);
    setFormData(null);
  };

  const handleExportToPDF = () => {
    if (!dataGridRef) return;

    const doc = new jsPDF();
    exportDataGrid({
      jsPDFDocument: doc,
      component: dataGridRef.instance,
    }).then(() => {
      doc.save("Receipt.pdf");
    });
  };

  return (
    <div>
      <div className="header-container">
        <h2>Receipt List</h2>
        <div className="btn-container">
          <Button className="btn1" onClick={handleExportToPDF}>
            Print
          </Button>
          <Button className="btn1" onClick={handleAdd}>
            Add
          </Button>
        </div>
      </div>
      <DataGrid
        dataSource={receiptList}
        ref={(ref) => setDataGridRef(ref)}
        onExporting={handleExportToPDF}
        onContentReady={handleContentReady}
      >
        <Column
          caption="S.No"
          width={80} 
          alignment="center"
          cellRender={(rowData) => {
            const pageSize = rowData.component.pageSize(); 
            const pageIndex = rowData.component.pageIndex(); 
            const rowIndex = rowData.rowIndex; 
            return <span>{pageIndex * pageSize + rowIndex + 1}</span>;
          }}
        />
        <Column
          dataField="ReceiptNo"
          caption="Receipt No"
          minWidth={100}
          alignment="center"
        />
        <Column
          dataField="ReceiptDate"
          caption="Receipt Date"
          dataType="date"
          format="dd-MM-yyyy"
          minWidth={100}
          alignment="center"
        />
        <Column
          dataField="NetAmount"
          caption="Net Amount"
          Width={1}
          alignment="center"
        />
        <Column dataField="Remarks" caption="Remarks" alignment="center" />
        <Column
          caption="Actions"
          alignment="center"
          cellRender={({ data }) => (
            <div className="action-buttons">
              <Button icon="edit" onClick={() => handleEdit(data)} />
              <Button icon="trash" onClick={() => handleDelete(data)} />
            </div>
          )}
        />
      </DataGrid>
      <div style={{ marginTop: "5px", textAlign: "left" }}>
        <strong>Total Records: {recordCount}</strong>
      </div>

      {isPopupVisible && (
        <ReceiptPopup
          title={formData?.ReceiptID ? "Edit Receipt" : "New Receipt"}
          visible={isPopupVisible}
          formData={formData}
          items={items}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

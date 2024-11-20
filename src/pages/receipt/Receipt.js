import { Button, DataGrid } from "devextreme-react";
import { Column } from "devextreme-react/data-grid";
import { useEffect, useState } from "react";
import { getReceiptListData } from "../../services/service.api";

export default function Receipt() {
  const [receiptList, setRecciptList] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const listdata = await getReceiptListData();
      setRecciptList(listdata?.data?.data);
    };
    fetchData();
  }, []);
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
                  //   onClick={() => handleEdit(data)}
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
    </div>
  );
}

import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable, type DataTableStateEvent } from "primereact/datatable";
import {
  InputNumber,
  type InputNumberValueChangeEvent,
} from "primereact/inputnumber";
import { OverlayPanel } from "primereact/overlaypanel";
import { Skeleton } from "primereact/skeleton";
import { useEffect, useRef, useState } from "react";
import useData from "../hooks/useData";
import type { IData } from "../models/data";

const Table = () => {
  const { response, loading, error, setPage, page } = useData();

  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState<
    {
      page: number;
      rows: number;
    }[]
  >([]);
  const [selectedRows, setSelectedRows] = useState<IData[]>([]);
  const [rowInput, setRowInput] = useState<number | null>();
  const op = useRef<OverlayPanel | null>(null);

  const onPageChange = (event: DataTableStateEvent) => {
    const newPage = (event.page || 0) + 1;
    if (page !== newPage) {
      setPage(newPage);
    }
  };

  const handleRowSelectionSubmit = () => {
    if (!rowInput) return;

    if (rowInput <= 12) {
      setSelectedRows(response?.data.slice(0, rowInput) || []);
      setSelectedRowsPerPage([{ page, rows: rowInput }]);
      return;
    }

    const newSelectedRowsPerPage = [];
    let remainingRows = rowInput;
    const extraPages = Math.ceil(rowInput / 12);

    for (let i = 1; i <= extraPages; i++) {
      const rowsToSelect = Math.min(12, remainingRows);
      newSelectedRowsPerPage.push({ page: i, rows: rowsToSelect });
      remainingRows -= rowsToSelect;
    }

    setSelectedRowsPerPage(newSelectedRowsPerPage);
    op.current?.hide();
  };

  // effect to handle row selection based on selectedRowsPerPage
  useEffect(() => {
    const currentPageData = response?.data || [];
    const currentPageSelectionExists = selectedRowsPerPage.find(
      (item) => item.page === page
    );

    if (currentPageSelectionExists) {
      const allSelectedRows = currentPageData.slice(
        0,
        currentPageSelectionExists.rows
      );

      setSelectedRows(allSelectedRows);
    }
  }, [selectedRowsPerPage, response?.data, page]);

  return (
    <>
      {loading ? (
        <Skeleton width="100%" height="500px"></Skeleton>
      ) : error ? (
        <p className="error-text">Encountered an unexpected error</p>
      ) : (
        <DataTable
          value={response?.data}
          paginator
          rows={12}
          tableStyle={{ minWidth: "50rem" }}
          totalRecords={120}
          lazy={true}
          onPage={onPageChange}
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)}
          selectionMode="multiple"
          dataKey="id"
        >
          <Column
            selectionMode="multiple"
            headerStyle={{ width: "3rem" }}
          ></Column>
          <Column
            style={{ padding: 0 }}
            header={
              <>
                <Button
                  type="button"
                  text
                  rounded
                  icon="pi pi-angle-down"
                  onClick={(e) => op.current?.toggle(e)}
                ></Button>
                <OverlayPanel
                  ref={op}
                  className="row-input-overlay"
                  closeOnEscape
                  showCloseIcon
                >
                  <InputNumber
                    className="block"
                    placeholder="selected rows.."
                    value={rowInput}
                    onValueChange={(e: InputNumberValueChangeEvent) =>
                      setRowInput(e.value)
                    }
                  />

                  <Button
                    className="block button-block"
                    onClick={handleRowSelectionSubmit}
                  >
                    Submit
                  </Button>
                </OverlayPanel>
              </>
            }
          ></Column>
          <Column field="title" header={"Title"}></Column>
          <Column field="place_of_origin" header="Place_of_origin"></Column>
          <Column field="artist_display" header="Artist_display"></Column>
          <Column field="inscriptions" header="Inscriptions"></Column>
          <Column field="date_start" header="Date_start"></Column>
          <Column field="date_end" header="Date_end"></Column>
        </DataTable>
      )}
    </>
  );
};

export default Table;

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
      rows: number[];
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
      const rowIndices = Array.from({ length: rowInput }, (_, i) => i);
      setSelectedRows(response?.data.slice(0, rowInput) || []);
      setSelectedRowsPerPage([
        ...selectedRowsPerPage,
        { page, rows: rowIndices },
      ]);
      op.current?.hide();
      return;
    }

    const newSelectedRowsPerPage = [];
    let remainingRows = rowInput;
    const extraPages = Math.ceil(rowInput / 12);

    for (let i = 1; i <= extraPages; i++) {
      const rowsToSelect = Math.min(12, remainingRows);
      const rowIndices = Array.from(
        { length: rowsToSelect },
        (_, index) => index
      );
      newSelectedRowsPerPage.push({ page: i, rows: rowIndices });
      remainingRows -= rowsToSelect;
    }

    setSelectedRowsPerPage([...selectedRowsPerPage, ...newSelectedRowsPerPage]);
    op.current?.hide();
  };

  // effect to handle row selection based on selectedRowsPerPage
  // biome-ignore lint/correctness/useExhaustiveDependencies: <page is not needed bsc changing page changes response.data & we are including response.data in deps>
  useEffect(() => {
    const currentPageData = response?.data || [];
    const currentPageSelectionExists = selectedRowsPerPage.find(
      (item) => item.page === page
    );

    if (currentPageSelectionExists) {
      const allSelectedRows = currentPageSelectionExists.rows.map(
        (index) => currentPageData[index]
      );

      setSelectedRows(allSelectedRows);
    }
  }, [selectedRowsPerPage, response?.data]);

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
          first={(page - 1) * 12}
          selection={selectedRows}
          onSelectionChange={(e) => {
            setSelectedRows(e.value);

            const currentPageData = response?.data || [];
            const allRowsSelected = e.value.length === currentPageData.length;

            if (allRowsSelected && currentPageData.length > 0) {
              const allRowIndices = Array.from({ length: 12 }, (_, i) => i);
              const updatedSelection = selectedRowsPerPage.filter(
                (item) => item.page !== page
              );
              updatedSelection.push({ page, rows: allRowIndices });
              setSelectedRowsPerPage(updatedSelection);
            } else if (e.value.length === 0) {
              const updatedSelection = selectedRowsPerPage.filter(
                (item) => item.page !== page
              );
              setSelectedRowsPerPage(updatedSelection);
            } else {
              // partial selection
              const selectedIndices = e.value
                .map((selectedRow) =>
                  currentPageData.findIndex((row) => row.id === selectedRow.id)
                )
                .filter((index) => index !== -1);

              const updatedSelection = selectedRowsPerPage.filter(
                (item) => item.page !== page
              );
              if (selectedIndices.length > 0) {
                updatedSelection.push({ page, rows: selectedIndices });
              }
              setSelectedRowsPerPage(updatedSelection);
            }
          }}
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
                  className="chevron-button"
                  type="button"
                  text
                  rounded
                  icon="pi pi-angle-down"
                  onClick={(e) => op.current?.toggle(e)}
                />
                <OverlayPanel
                  ref={op}
                  className="row-input-overlay"
                  closeOnEscape
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
          <Column field="title" header="Title"></Column>
          <Column field="place_of_origin" header="Place of origin"></Column>
          <Column field="artist_display" header="Artist display"></Column>
          <Column field="inscriptions" header="Inscriptions"></Column>
          <Column field="date_start" header="Date start"></Column>
          <Column field="date_end" header="Date end"></Column>
        </DataTable>
      )}
    </>
  );
};

export default Table;

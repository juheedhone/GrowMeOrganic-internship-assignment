import axios from "axios";
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

interface IData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: null;
  date_start: number;
  date_end: number;
}

interface IResponse {
  data: IData[];
  pagination: {
    current_page: number;
    limit: number;
    next_url: string;
    offset: number;
    total: number;
    total_pages: number;
  };
}

const Table = () => {
  const [response, setResponse] = useState<IResponse>();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<IData[]>([]);
  const [rowInput, setRowInput] = useState<number | null>();
  console.log(rowInput);
  const op = useRef<OverlayPanel | null>(null);

  const onPageChange = (event: DataTableStateEvent) => {
    const newPage = (event.page || 0) + 1;
    if (page !== newPage) {
      setPage(newPage);
    }
  };

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.artic.edu/api/v1/artworks?page=${page}`)
      .then((data) => setResponse(data.data))
      .catch((error) => {
        console.log(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [page]);

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
          selection={selectedProducts}
          onSelectionChange={(e) => setSelectedProducts(e.value)}
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
                <OverlayPanel ref={op} className="row-input-overlay">
                  <InputNumber
                    className="block"
                    placeholder="selected rows.."
                    value={rowInput}
                    onValueChange={(e: InputNumberValueChangeEvent) =>
                      setRowInput(e.value)
                    }
                  />

                  <Button className="block button-block">Submit</Button>
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

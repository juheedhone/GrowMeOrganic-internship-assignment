import axios from "axios";
import { Column } from "primereact/column";

import { DataTable } from "primereact/datatable";
import { useEffect, useState } from "react";

interface IData {
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

  useEffect(() => {
    axios
      .get("https://api.artic.edu/api/v1/artworks?page=1")
      .then((data) => setResponse(data.data));
  }, []);

  return (
    <div className="card">
      <DataTable
        value={response?.data}
        paginator
        rows={5}
        rowsPerPageOptions={[5, 10, 25, 50]}
        tableStyle={{ minWidth: "50rem" }}
      >
        <Column field="title" header="Title"></Column>
        <Column field="place_of_origin" header="Place_of_origin"></Column>
        <Column field="artist_display" header="Artist_display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Date_start"></Column>
        <Column field="date_end" header="Date_end"></Column>
      </DataTable>
    </div>
  );
};

export default Table;

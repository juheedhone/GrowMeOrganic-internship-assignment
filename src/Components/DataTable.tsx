import axios from "axios";
import { useEffect, useState } from "react";

interface datas {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: null;
  date_start: number;
  date_end: number;
}

const DataTable = () => {
  const [data, setData] = useState();

  useEffect(() => {
    axios
      .get("https://api.artic.edu/api/v1/artworks?page=1")
      .then((res) => console.log(res));
  });

  return <div>dataTable</div>;
};

export default DataTable;

import axios, { CanceledError } from "axios";
import { useEffect, useState } from "react";
import type { IResponse } from "../models/data";

const useData = () => {
  const [response, setResponse] = useState<IResponse>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.artic.edu/api/v1/artworks?page=${page}`)
      .then((data) => setResponse(data.data))
      .catch((error) => {
        if (error instanceof CanceledError) return;
        console.log(error);
        setError(true);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return {
    response,
    loading,
    error,
    setPage,
    page,
  };
};

export default useData;

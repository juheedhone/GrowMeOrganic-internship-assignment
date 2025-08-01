export interface IData {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: null;
  date_start: number;
  date_end: number;
}

export interface IResponse {
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

//calificación
export type Review = {
  id?: string;
  product_id: string;
  name: string;
  qualification: number;
  comment: string;
  date: string;
};
//calificaciones paginadas
export type ReviewData = {
  total: number;
  pages: number;
  first: number;
  next: number | null;
  prev: number | null;
  data: Review[];
};

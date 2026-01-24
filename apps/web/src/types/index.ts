export interface QueryRes<T> {
  items: T[];
  meta: {
    total: number;
    take: number;
    skip: number;
  };
}

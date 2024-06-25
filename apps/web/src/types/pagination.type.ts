export interface IPaginationQueries {
  take?: number;
  page?: number;
  stockJournalsPage?: number;
  stockJournalsTake?: number;
  sortBy?: string;
  sortOrder?: string;
}

export interface IPaginationMeta {
  page: number;
  take: number;
  total: number;
}

export interface iListRequest {
  listName: string;
  data: Array<iItemData>;
}

export interface iListResponse {
  listName: string;
  id: string;
  data: Array<iItemDataWithId>;
}

export interface iItemData {
  name: string;
  quantity: string;
}

export interface iItemDataWithId extends iItemData {
  id: string;
}

import { Request, Response } from "express";
import {
  iItemData,
  iItemDataWithId,
  iListRequest,
  iListResponse,
} from "./interfaces";
//import { v4 as uuid } from "uuid";
import { dataList } from "./database";
//------------------------------------------------------------------------------------
export const createList = (req: Request, res: Response): Response => {
  const dataRequest: iListRequest = req.body;
  const item = req.body.data;
  const newItem = item.map((elem: iItemData) => {
    const newItemWithId: iItemDataWithId = {
      ...elem,
      id: (Math.random() * 10).toFixed(0).toString(),
    };
    return newItemWithId;
  });
  //------------------------------------------------------------------------------------
  const newData: iListResponse = {
    ...dataRequest,
    data: newItem,
    id: (Math.random() * 10).toFixed(0).toString(),
  };
  dataList.push(newData);
  return res.status(201).json(newData);
};
//------------------------------------------------------------------------------------
export const showList = (req: Request, res: Response): Response => {
  const data: Array<iListResponse> = dataList;

  return res.status(200).json(data);
};
//------------------------------------------------------------------------------------
export const showUniqueList = (req: Request, res: Response): Response => {
  const listId: string = req.params.id;
  const filterId: Array<iListResponse> = dataList.filter((item) => {
    return item.id === listId;
  });
  return res.status(200).json(filterId);
};
//------------------------------------------------------------------------------------
export const updateItemList = (req: Request, res: Response): Response => {
  const newItem: iItemData = req.body;
  const listId: string = req.params.idList;
  const itemId: string = req.params.idItem;

  const newList = dataList.map((list: iListResponse) => {
    if (list.id === listId) {
      const itemModified = list.data.map(
        (item: iItemDataWithId): iItemDataWithId | string => {
          if (item.id === itemId) {
            item.name = newItem.name;
            item.quantity = newItem.quantity;
          }
          return item;
        }
      );
      return itemModified;
    } else {
      return "Lista inexistente";
    }
  });
  return res.status(200).json(newList[0]);
};
//------------------------------------------------------------------------------------
export const deleteList = (req: Request, res: Response): Response => {
  const indexOfList = dataList.findIndex((list) => {
    return list.id === req.params.idList;
  });
  dataList.splice(indexOfList, 1);
  return res.status(200).send("Hello");
};
//------------------------------------------------------------------------------------
export const deleteItem = (req: Request, res: Response): Response => {
  const indexOfItem = dataList.map((list) => {
    if (list.id === req.params.idList) {
      return list;
    }
    return list;
  });
  console.log(indexOfItem);
  return res.json(indexOfItem);
};

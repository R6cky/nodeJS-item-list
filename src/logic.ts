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
  const itemsRequest = req.body.data;

  const newItem = itemsRequest.map((elem: iItemData) => {
    const newItemWithId: iItemDataWithId = {
      ...elem,
      id: (Math.random() * 10).toFixed(0).toString(),
    };
    return newItemWithId;
  });
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
  const filterId: iListResponse | undefined = dataList.find((item) => {
    return item.id === listId;
  });
  if (!filterId) {
    const errorMessage: string = "List Not found";
    return res.status(404).json({ errorMessage });
  }
  return res.status(200).json([filterId]);
};
//------------------------------------------------------------------------------------
export const updateItemList = (req: Request, res: Response): Response => {
  const newItem: iItemData = req.body;
  const listId: string = req.params.idList;
  const itemId: string = req.params.idItem;

  const listExists = dataList.find((list) => {
    return list.id === req.params.idList;
  });

  if (!listExists) {
    const error = "List not found";
    return res.status(404).json({ error });
  }

  const newListItem = dataList.map((list: iListResponse) => {
    const findItem = list.data.find((item: iItemDataWithId) => {
      return item.id === req.params.idItem;
    });
    if (!findItem) {
      const error = "Item not found";
      return res.status(404).json({ error });
    }

    const findItemName = list.data.find((item) => {
      return item.name === req.body.name;
    });
    if (findItemName) {
      return res.status(409).json({ message: "Item name already exist" });
    }

    if (list.id === listId) {
      const itemModified = list.data.map((item): iItemDataWithId => {
        if (item.id === itemId) {
          item.name = newItem.name;
          item.quantity = newItem.quantity;
        }
        return item;
      });
      return itemModified;
    }
  });

  return res.status(200).json(newListItem[0]);
};
//------------------------------------------------------------------------------------
export const deleteList = (req: Request, res: Response): Response => {
  const listId = req.params.idList;

  const findList: iListResponse | undefined = dataList.find(
    (list: iListResponse) => {
      return list.id === listId;
    }
  );

  if (!findList) {
    const error = "List Not found";
    return res.status(404).json({ error });
  }

  const indexOfList: number = dataList.findIndex((list: iListResponse) => {
    return list.id === req.params.idList;
  });
  dataList.splice(indexOfList, 1);
  return res.status(200).send();
};
//------------------------------------------------------------------------------------
export const deleteItem = (req: Request, res: Response): Response => {
  const listId = req.params.idList;
  const itemId = req.params.idItem;

  const findList: iListResponse | undefined = dataList.find((list) => {
    return list.id === listId;
  });

  if (!findList) {
    const error = "List Not found";
    return res.status(404).json({ error });
  }

  const findItem: iItemDataWithId | undefined = findList.data.find((item) => {
    return item.id === itemId;
  });

  if (!findItem) {
    return res.status(404).json({ message: "Item Not Found" });
  }
  const indexOfItem: number = findList.data.findIndex(
    (item) => item.id === req.params.idItem
  );
  findList.data.splice(indexOfItem, 1);

  return res.status(200).send();
};

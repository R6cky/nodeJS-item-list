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
  const keysOfRequest = Object.keys(dataRequest);
  const valuesOfRequest = Object.values(dataRequest);
  const itemsRequest = req.body.data;

  itemsRequest.forEach((item: any) => {
    const itemKeys: Array<string> = Object.keys(item);
    const valueKeys: Array<string> = Object.values(item);
    const itemValidating = ["name", "quantity"];
    const itemKeysValid = itemValidating.every((key) => {
      return itemKeys.includes(key);
    });
    if (!(itemKeysValid && itemKeys.length === itemValidating.length)) {
      return res
        .status(400)
        .json({ message: `Keys required: ${itemValidating}` });
    }

    if (
      !(typeof valueKeys[0] === "string" && typeof valueKeys[1] === "string")
    ) {
      return res
        .status(400)
        .json({ message: `Values of ${itemKeys} Must be a string` });
    }
  });

  //call function of validate data of list create
  validateDataOfListCreate(dataRequest, res);

  const findName: iListResponse | undefined = dataList.find((list) => {
    return list.listName === req.body.listName;
  });

  if (findName) {
    const error = "List name already exist";
    return res.status(409).json({ error });
  }

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
//---------------------------------------------------------------------------------------------
//Data validation functions

const validateDataOfListCreate = (payload: any, res: Response) => {
  const keysOfRequest = Object.keys(payload);
  const valuesOfRequest = Object.values(payload);
  const dataRequest = payload.data;
  const listValidating = ["listName", "data"];

  const isIncludesInKeys = keysOfRequest.every((key) => {
    return listValidating.includes(key);
  });

  if (!(isIncludesInKeys && keysOfRequest.length === listValidating.length)) {
    return res
      .status(400)
      .json({ message: `Keys required: ${listValidating}` });
  }

  if (!(typeof valuesOfRequest[0] === "string")) {
    return res.status(400).json({
      message: `The data format is not valid. ${keysOfRequest[0]} Must be a string`,
    });
  }

  if (!(typeof valuesOfRequest[1] === "object")) {
    return res.status(400).json({
      message: `The data format is not valid. ${keysOfRequest[1]} Must be a array list`,
    });
  }

  if (dataRequest.length === 0) {
    return res.status(400).json({
      message: `${keysOfRequest[1]}  cannot be empty`,
    });
  }
};

const validateDataOfItemListCreate = (payload: any, res: Response) => {
  const keysOfRequest = Object.keys(payload);
  const valuesOfRequest = Object.values(payload);
  const listValidating = ["name", "quantity"];
  const dataItemList: any = payload.data;
  console.log(dataItemList);
  const isIncludesInKeys = keysOfRequest.every((key) => {
    return listValidating.includes(key);
  });

  if (!(isIncludesInKeys && keysOfRequest.length === listValidating.length)) {
    return res
      .status(400)
      .json({ message: `Keys required: ${listValidating}` });
  }

  if (!(typeof valuesOfRequest[0] === "string")) {
    return res.status(400).json({
      message: `The data format is not valid. ${keysOfRequest[0]} Must be a string`,
    });
  }

  if (!(typeof valuesOfRequest[1] === "object")) {
    return res.status(400).json({
      message: `The data format is not valid. ${keysOfRequest[1]} Must be a array list`,
    });
  }
};

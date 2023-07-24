import { Request, Response, NextFunction } from "express";
import { iListRequest, iListResponse } from "./interfaces";
import { dataList } from "./database";

export const middlewareValidateDataOfListCreate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const dataRequest: iListRequest = req.body;
  const listValidating = ["listName", "data"];

  const findName: iListResponse | undefined = dataList.find((list) => {
    return list.listName === req.body.listName;
  });

  if (findName) {
    const error = "List name already exist";
    return res.status(409).json({ error });
  }

  const keysOfRequest = Object.keys(dataRequest);
  const valuesOfRequest = Object.values(dataRequest);

  const isIncludesInKeys = listValidating.every((key) => {
    return keysOfRequest.includes(key);
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
      message: `The data format is not valid. ${keysOfRequest[1]} must be a array list`,
    });
  }

  if (dataRequest.data.length === 0) {
    return res.status(400).json({
      message: `${keysOfRequest[1]} cannot be empty`,
    });
  }
  return next();
};

export const middlewareValidateDataOfItemListCreate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const itemValidating = ["name", "quantity"];
  const arrItemsName: Array<any> = [];

  for (const item of req.body.data) {
    const itemKeys: Array<string> = Object.keys(item);
    const valueKeys: Array<string> = Object.values(item);
    arrItemsName.push(item.name);
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
        .json({ message: `Values of ${itemKeys} must be a string` });
    }
  }

  if (new Set(arrItemsName).size !== arrItemsName.length) {
    return res.status(409).json({ message: "Item names must be different" });
  }
  return next();
};

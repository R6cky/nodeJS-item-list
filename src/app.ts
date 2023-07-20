import express, { Application } from "express";
import cors from "cors";

import {
  createList,
  deleteItem,
  deleteList,
  showList,
  showUniqueList,
  updateItemList,
} from "../src/logic";
import {
  middlewareValidateDataOfItemListCreate,
  middlewareValidateDataOfListCreate,
} from "./middlewares";
const app: Application = express();

const port: number = 2000;
app.use(express.json());
app.use(cors());

app.post(
  "/purchaseList",
  middlewareValidateDataOfListCreate,
  middlewareValidateDataOfItemListCreate,
  createList
);
app.get("/purchaseList", showList);
app.get("/purchaseList/:id", showUniqueList);
app.patch("/purchaseList/:idList/:idItem", updateItemList);
app.delete("/purchaseList/:idList", deleteList);
app.delete("/purchaseList/:idList/:idItem", deleteItem);

app.listen(port, () => {
  console.log("Server running on port 2000");
});

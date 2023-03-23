import axios from "axios";
import { apiLink } from "./config";

axios.defaults.baseURL = apiLink;

if (localStorage.getItem("token_expense")) {
  axios.defaults.headers.common[
    "Authorization"
  ] = `Bearer ${localStorage.getItem("token_user")}`;
} else {
  delete axios.defaults.headers.common["Authorization"];
}
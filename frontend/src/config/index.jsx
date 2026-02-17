import axios from "axios";

export const BASE_URL = "http://localhost:8090";

export const clientServer = axios.create({
  baseURL: BASE_URL,
 
  headers: {
    "Content-Type": "application/json"
  }
});

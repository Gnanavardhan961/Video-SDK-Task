import jwt from "jsonwebtoken";

const API_KEY = "73fbe717-0e79-4c51-a01d-de35336d7f02";
const API_SECRET = "aa959e7beededa76cb16dee1bdd69de98d7758db1d55264d27c87ca797aa0a93";

const payload = {
  apikey: API_KEY,
  permissions: ["allow_join", "allow_mod", "allow_create"],
};

const token = jwt.sign(payload, API_SECRET, { expiresIn: "7d" });

console.log(token);


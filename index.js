import express from "express";
import {Pool} from 'pg';

import dotenv from "dotenv";
dotenv.config();

const app = express();


app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});


const pool = new Pool({
  host: process.env.HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.POSTGRE_USER,
  database: process.env.DATABASE_NAME,
  password: process.env.POSTGRE_PASSWORD,
});


async function getProducts(category) {
  try {
    const result = await pool.query(`SELECT * FROM ${category}`);
    return result.rows;
  } catch (err) {
    console.error(err);
    return [];
  }
}


app.get("/", async (req, res) => {
  const category = req.query.category;

  if (!["smartphones", "laptops", "headphones"].includes(category)) {
    return res.status(404).json({ error: "Category not found" });
  }

  const tableMap = {
    smartphones: "Smartphones",
    laptops: "Laptops",
    headphones: "Headphones",
  };

  const products = await getProducts(tableMap[category]);
  res.json(products);
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

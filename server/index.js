// imports here for express and pg
import express from "express";
import path from "path";
import pg from "pg";

const app = express();
const PORT = process.env.PORT || 3000;

const client = new pg.Client({
  database: "acme_hr_db",
});

// static routes here (you only need these for deployment)
app.get("/", (req, res) => {
  res.sendFile(
    path.join(import.meta.dirname, "..", "client", "dist", "index.html")
  );
});

// app routes here
app.get("/api/employees", async (req, res) => {
  const { rows } = await client.query("SELECT * FROM employees");
  res.send(rows);
});

// create your init function
const init = async () => {
  await client.connect();

  await client.query(`
    DROP TABLE IF EXISTS employees;
    CREATE TABLE employees (
      id SERIAL PRIMARY KEY,
      name VARCHAR(50),
      admin BOOLEAN DEFAULT FALSE
    );

    INSERT INTO employees (id, name, admin)
    VALUES 
      (1, 'John Doe', False),
      (2, 'Jane Doe', True)
    ;
  `);

  // init function invocation
  app.listen(PORT, () => {
    console.log(`Server now running on http://localhost:${PORT}`);
  });
};

init();

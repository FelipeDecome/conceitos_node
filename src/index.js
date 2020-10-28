const express = require("express");
const uuid = require("uuidv4");

const app = express();

app.use(express.json());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, owner } = request.body;

  const repository = {
    id: uuid(),
    title,
    owner,
  };

  repositories.push(repository);

  return response.status(201).json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
});

app.delete("/repositories/:id", (request, response) => {
  // TODO
});

app.listen(3333, () => {
  console.log(`🆙 Server listening on port: 3333`);
});

const express = require("express");
const {uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());

const repositories = [];

function logRequests(request, response, next) {
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.time(logLabel);

  next();

  console.timeEnd(logLabel); 
}

function validRepositoryID(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id))
    return response.status(400).json({ error: "Invalid Repository ID" });

  return next();
}

function verifyIfRepositoryExists(request, response, next) {
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if (repositoryIndex < 0)
    return response.status(400).json({ error: "Repository does not exists" });

  request.body.id = id;
  request.body.repositoryIndex = repositoryIndex;

  return next();
}

app.use(logRequests);
app.use('/repositories/:id', validRepositoryID, verifyIfRepositoryExists);

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
  const { id, title, owner, repositoryIndex } = request.body;

  const repository = {
    id,
    title,
    owner,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (request, response) => {
  const { repositoryIndex } = request.body;

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();
});

app.listen(3333, () => {
  console.log(`🆙 Server listening on port: 3333`);
});

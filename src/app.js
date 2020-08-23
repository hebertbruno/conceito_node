const express = require("express");
const {uuid, isUuid} = require("uuidv4");
const cors = require("cors");

// const { v4: uuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

//Verificar se Id é existente
app.use('/repositories/:id', (request, response, next) =>{
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Repository not found!"})
  }
  return next();
})

//Verificar se a rota de like para o id selecionado existe
app.use('/repositories/:id/like', (request, response, next) =>{
  const {id} = request.params;

  if(!isUuid(id)){
    return response.status(400).json({error: "Repository not found!"})
  }
  return next();
})

//array dos repositorios
const repositories = [];

//Lista todos os repositorios cadastrados
app.get("/repositories", (request, response) => {
   
  return response.json(repositories);
});

//Cria um novo repositorio
app.post("/repositories", (request, response) => {
  const{ title, url, techs} = request.body;
  const repository = {id: uuid(), title, url, techs, likes: 0 };  
  repositories.push(repository);
  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  
  const {id} = request.params;
  const {title, url, techs} = request.body;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);


  const repository ={
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);
  
  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;
  
  const repository = repositories.find(repository => repository.id === id);
  repository.likes++; 

  
  return response.json(repository);;

});

module.exports = app;

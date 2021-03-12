const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  // Complete aqui
  const {username} = request.headers;
  
  //console.log('username', username);
  if (username){
    const userRequest = users.find(user => user.username === username);
    if (userRequest){
      request.user = userRequest;
      return next();
    } else {
      return response.status(404).json({error: 'Username not found'});
    }
  } else {
    return response.status(404).json({error: 'Username is required'});
  }
}

app.post('/users', (request, response) => {
  // Complete aqui
  const {name, username} = request.body;  

  const userExists = users.find(user => user.username === username);
    if (userExists){      
      return response.status(400).json({error: 'Username already exists'});
    }

  const newUser = { 
    id: uuidv4(), // precisa ser um uuid
    name: name, 
    username: username, 
    todos: []
  }
  users.push(newUser);
  return response.status(201).json(newUser);  
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui 
  return response.status(200).json(request.user.todos);    
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const {title, deadline } = request.body;
  const todo = { 
    id: uuidv4(), // precisa ser um uuid
    title,
    done: false, 
    deadline: new Date(deadline), 
	  created_at: new Date()
  }
  request.user.todos.push(todo);
  
  return response.status(201).json(todo);
});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { title, deadline } = request.body;
  const { id } = request.params;

  const todoToUpdate = request.user.todos.find(todo => todo.id === id);

  if (todoToUpdate) {
    todoToUpdate.title = title;
    todoToUpdate.deadline = deadline;    
      
    return response.status(200).json(todoToUpdate);
  } else {
    return response.status(404).json({error: 'todo not found'});
  }
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;

  const todoToUpdate = request.user.todos.find(todo => todo.id === id);

  if (todoToUpdate) {
    todoToUpdate.done = true;          
    return response.status(200).json(todoToUpdate);
  } else {
    return response.status(404).json({error: 'todo not found'});
  }
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  // Complete aqui
  const { id } = request.params;

  const todoToDelete = request.user.todos.find(todo => todo.id === id);

  if (todoToDelete) {
    request.user.todos.splice(todoToDelete,1);    
    return response.status(204).json(request.user.todos);
  } else {
    return response.status(404).json({error: 'todo not found'});
  }
});

module.exports = app;
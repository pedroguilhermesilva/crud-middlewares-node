const express = require("express");

const server = express();

server.use(express.json());

const projects = [];
let logNumber = 0;

function numbersLogs(req, res, next) {
  logNumber++;

  console.log(`Número de requisições ${logNumber}`);

  return next();
}

function checkProjectExist(req, res, next) {
  const { id } = req.params;

  const project = projects.findIndex(p => p.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

//Take all projects
server.get("/project", numbersLogs, (req, res) => {
  return res.json(projects);
});

//Create a projects
server.post("/project", numbersLogs, (req, res) => {
  const { id, title } = req.body;

  const project = {
    id,
    title,
    tasks: []
  };

  projects.push(project);

  return res.json(project);
});

//Modify the title of 'this' projects
server.put("/project/:id", checkProjectExist, numbersLogs, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id === id);

  project.title = title;

  return res.json(project);
});

//Delete a projects
server.delete("/project/:id", checkProjectExist, numbersLogs, (req, res) => {
  const { id } = req.params;

  const projectIndex = projects.findIndex(p => p.id === id);

  projects.splice(projectIndex, 1);

  return res.send();
});

//Add a Tasks on projects
server.post(
  "/project/:id/tasks",
  checkProjectExist,
  numbersLogs,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;

    const project = projects.find(p => p.id === id);

    project.tasks.push(title);

    return res.json(project);
  }
);

server.listen(3000);

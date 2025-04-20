const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const usersFilePath = path.join(__dirname, 'users.json');
const tasksFilePath = path.join(__dirname, 'tasks.json');

if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

if (!fs.existsSync(tasksFilePath)) {
  fs.writeFileSync(tasksFilePath, JSON.stringify([]));
}

app.get('/users', (req, res) => {
  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(data);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la lecture des utilisateurs.' });
  }
});

app.post('/users', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Nom requis' });
  }

  try {
    const data = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(data);

    const existingUser = users.find(u => u.name === name);
    if (existingUser) {
      return res.status(400).json({ message: 'Utilisateur déjà existant' });
    }

    const newUser = { name };
    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.status(201).json({ message: 'Utilisateur ajouté', user: newUser });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de l\'utilisateur.' });
  }
});

// Récupérer les tâches d'un utilisateur
app.get('/tasks/:username', (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ message: 'Nom d\'utilisateur requis' });
  }

  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    const tasks = JSON.parse(data);
    const userTasks = tasks.filter(t => t.user === username);
    
    if (userTasks.length === 0) {
      return res.json({ message: 'Utilisateur connecté. Vous pouvez entrer des tâches.', tasks: [] });
    }

    res.json({ tasks: userTasks });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la récupération des tâches.' });
  }
});

// Ajouter une tâche
app.post('/tasks', (req, res) => {
  const { user, task } = req.body;

  if (!user || !task) {
    return res.status(400).json({ message: 'Utilisateur et tâche requis' });
  }

  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    const tasks = JSON.parse(data);

    const newTask = { user, task };
    tasks.push(newTask);
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));

    res.status(201).json({ message: 'Tâche ajoutée', task: newTask });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l\'ajout de la tâche.' });
  }
});

// Supprimer une tâche
app.delete('/tasks', (req, res) => {
  const { user, task } = req.body;

  if (!user || !task) {
    return res.status(400).json({ message: 'Utilisateur et tâche requis' });
  }

  try {
    const data = fs.readFileSync(tasksFilePath, 'utf8');
    let tasks = JSON.parse(data);

    const initialLength = tasks.length;
    tasks = tasks.filter(t => !(t.user === user && t.task === task));

    if (tasks.length === initialLength) {
      return res.status(404).json({ message: 'Tâche non trouvée' });
    }

    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
    res.status(200).json({ message: 'Tâche supprimée' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la tâche.' });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Accède au serveur ici : http://localhost:${PORT}`);
});
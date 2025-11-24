const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { sequelize, testConnection } = require('./config/database');
const Task = require('./models/Task');
const User = require('./models/User');

const app = express();

app.use(cors());
app.use(express.json());

testConnection();

User.hasMany(Task, { foreignKey: 'UserId' });
Task.belongsTo(User, { foreignKey: 'UserId' });

// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/tasks', require('./routes/tasks'));

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
};

syncDatabase();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
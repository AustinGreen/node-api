import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import 'dotenv/config';
import models, { sequelize } from './models';
import routes from './routes';

const app = express();
app.use(express.json());
app.use(async (req, res, next) => {
  req.context = {
    models,
    me: await models.User.findByLogin('rwieruch'),
  };
  next();
});

app.use('/api/session', routes.session);
app.use('/api/users', routes.user);
app.use('/api/messages', routes.message);

const eraseDatabaseOnSync = true;
sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUsersWithMessages();
  }
  app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`));
});


const createUsersWithMessages = async () => {
  await models.User.create(
    {
      username: 'austin',
      messages: [
        {
          text: 'Hello world',
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
  await models.User.create(
    {
      username: 'alice',
      messages: [
        {
          text: 'Hi bob',
        },
        {
          text: 'Whats up?',
        },
      ],
    },
    {
      include: [models.Message],
    }
  );
};

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);

app.get('/api/jobs', async (req, res) => {
  const jobs = await getAsync('github');

  return res.send(jobs);
});

app.get('/api/session', (req, res) => {
  return res.send(req.context.models.users[req.context.me.id]);
});

app.get('/api/users', (req, res) => {
  return res.send(Object.values(req.context.models.users));
});

app.get('/api/users/:userId', (req, res) => {
  return res.send(req.context.models.users[req.params.userId]);
});

app.get('/api/messages', (req, res) => {
  return res.send(Object.values(req.context.models.messages));
});

app.get('/api/messages/:messageId', (req, res) => {
  return res.send(req.context.models.messages[req.params.messageId]);
});

app.post('/api/messages', (req, res) => {
  const id = uuidv4();
  const message = {
    id,
    text: req.body.text,
    userId: req.context.me.id,
  };
  req.context.models.messages[id] = message;
  return res.send(message);
});

app.delete('/api/messages/:messageId', (req, res) => {
  const { [req.params.messageId]: message, ...otherMessages } = req.context.models.messages;
  req.context.models.messages = otherMessages;
  return res.send(message);
});

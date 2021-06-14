const express = require('express');
const userRouter = require('./router/user');
const app = express();
const port = process.env.PORT || 3000; //process.env.port is heroku port

app.use(express.json()); //parses json to object
app.use(userRouter);

app.listen(port, () => {
  console.log('Server is up on port', port);
});

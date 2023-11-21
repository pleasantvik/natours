const dotenv = require('dotenv');

dotenv.config({
  path: './config.env',
});
const app = require('./app');

//? SERVER STARTS
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => `Listening at Port ${PORT}`);

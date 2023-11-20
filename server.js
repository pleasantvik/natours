const app = require('./app');

//? SERVER STARTS
const PORT = 5000;
app.listen(PORT, () => console.log(`Listening at Port ${PORT}`));

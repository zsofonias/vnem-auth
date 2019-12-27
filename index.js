require('dotenv').config();
const mongoose = require('mongoose');

const app = require('./app');

const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.DB_CONNECTION, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('DB Connection is ON');
  })
  .catch(err => {
    console.log(`Unable to connect DB: ${err}`);
  });

const server = app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});

// catch unhandle rejections and errors
process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  server.close(() => process.exit(1));
});

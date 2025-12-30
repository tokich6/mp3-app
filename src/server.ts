import app from './app';

const port = process.env.PORT || 3000; // move to a config file

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

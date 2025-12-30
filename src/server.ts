import app from './app';

const port = process.env.PORT || 3000; // TODO: move to config

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
import express from 'express';
import * as fs from "fs";
import * as path from "path";
const app = express();

const PORT = process.env.PORT || 3001;

app.use('/images', express.static('../public'))

app.use(express.static('../picture-gallery-client/build'));

app.get("/api(/*)?", (req, res) => {
    const path = req.path.substring(4)

    const dirents = fs.readdirSync('../public' + path, {withFileTypes: true}) // TODO: error handling?

    const normalizedPath = path === '/' ? "" : path
    const images = dirents.filter(f => f.isFile()).map(f => `/images${normalizedPath}/${f.name}`)
    const directories = dirents.filter(f => f.isDirectory()).map(d => `${normalizedPath}/${d.name}`)

    res.json({ images: images, directories: directories });
});

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../picture-gallery-client/build/index.html')); // TODO: make usage of paths easier or configurabe?
});

// TODO: get nodemon or something similar to work to watch for changes
app.listen(PORT, () => {
    return console.log(`Express is listening at http://localhost:${PORT}`);
});

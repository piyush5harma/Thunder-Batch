import express from "express";
import { movies } from "./data.js";

const app = express();
app.use(express.json());

// Logger Middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Auth Middleware (Applied globally, but only checked where needed)
app.use((req, res, next) => {
  req.isAdmin = req.headers.role === "admin";
  next();
});

app.get("/", (req, res) => {
  res.send("Movie API is working");
});

// GET movie by ID
app.get("/movies/:id", (req, res) => {
  const id = req.params.id;
  // Use loose equality (==) only if your IDs in data.js are mixed (string/number). 
  // Strict equality (===) is safer if you cast req.params.id to a Number.
  const movie = movies.find((p1) => p1.id == id);
  
  if (!movie) {
    return res.status(404).json({ error: "Movie Not found" });
  }
  res.json(movie);
});

// GET movies with filters
app.get("/movies", (req, res) => {
  const { genre, language, rating, releaseYear, availableOnOTT, search } = req.query;
  let filterData = [...movies]; // Avoid mutating the original array reference directly

  if (genre) {
    filterData = filterData.filter((p) => p.genre?.toLowerCase() === genre.toLowerCase());
  }
  if (language) {
    filterData = filterData.filter((p) => p.language?.toLowerCase() === language.toLowerCase());
  }
  if (rating) {
    filterData = filterData.filter((p) => p.rating >= Number(rating));
  }
  if (releaseYear) {
    filterData = filterData.filter((p) => p.releaseYear >= Number(releaseYear));
  }
  if (availableOnOTT !== undefined) {
    const isAvailable = availableOnOTT === "true";
    filterData = filterData.filter((p) => p.availableOnOTT === isAvailable);
  }
  if (search) {
    filterData = filterData.filter((p) => 
      p.title?.toLowerCase().includes(search.toLowerCase())
    );
  }
  res.json(filterData);
});

// POST a new movie
app.post("/movies", (req, res) => {
  const { title, genre, language, rating, releaseYear, availableOnOTT } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  // Generate a unique ID (Handling string vs number fallback)
  const newId = movies.length > 0 ? Math.max(...movies.map(m => Number(m.id) || 0)) + 1 : 1;

  const newMovie = {
    id: newId,
    title,
    genre,
    language,
    rating: Number(rating) || 0,
    releaseYear: Number(releaseYear) || new Date().getFullYear(),
    availableOnOTT: availableOnOTT === true || availableOnOTT === "true"
  };

  movies.push(newMovie);
  res.status(201).json({
    message: "Movie created successfully",
    movie: newMovie
  });
});

// PATCH (Partial Update)
app.patch("/movies/:id", (req, res) => {
  const fetchMovie = movies.find((p) => p.id == req.params.id);
  
  if (!fetchMovie) {
    return res.status(404).json({ error: "Movie not found" });
  }

  // Prevent client from changing the ID
  delete req.body.id; 

  Object.assign(fetchMovie, req.body);
  res.json({
    message: "Movie updated successfully",
    movie: fetchMovie
  });
});

// PUT (Full Replacement)
app.put("/movies/:id", (req, res) => {
  const index = movies.findIndex((p) => p.id == req.params.id);
  
  if (index === -1) {
    return res.status(404).json({ error: "Movie not found" });
  }

  const { title, genre, language, rating, releaseYear, availableOnOTT } = req.body;

  // Replace the entire object structure, retaining only the original ID
  movies[index] = {
    id: movies[index].id,
    title: title || null,
    genre: genre || null,
    language: language || null,
    rating: rating !== undefined ? Number(rating) : null,
    releaseYear: releaseYear !== undefined ? Number(releaseYear) : null,
    availableOnOTT: availableOnOTT === true || availableOnOTT === "true"
  };

  res.json({
    message: "Movie replaced successfully",
    movie: movies[index]
  });
});

// DELETE
app.delete("/movies/:id", (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ error: "Forbidden: Admin access required" });
  }

  const id = req.params.id;
  const index = movies.findIndex((p) => p.id == id);
  
  if (index >= 0) {
    const deletedMovie = movies.splice(index, 1);
    res.json({
      message: "Movie deleted successfully",
      movie: deletedMovie[0]
    });
  } else {
    res.status(404).json({ error: "Movie not found" });
  }
});

app.listen(3000, () => {
  console.log("Listening at port 3000");
});
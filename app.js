import express from "express"
import { movies } from "./data.js";
const app = express();
app.use(express.json());
app.listen(3000,()=>{
    console.log("Listening at port 3000")
})

app.use("/",(req, res, next) => {
  console.log(req.method, req.url);
  next();
});
app.use((req, res, next) => {
    if (req.headers.role === "admin") {
        req.isAdmin = true;
    } else {
        req.isAdmin = false;
    }

    next();
});

app.get("/",(req,res)=>{
    res.send("Movie api is working");
})
// app.get("/movies",(req,res)=>{
//   res.json(movies);
// })
app.get("/movies/:id", (req,res)=>{
    const id=req.params.id;
    const movie = movies.find((p1)=> p1.id==id)
    if(!movie) return res.status(404).send("Movie Not found");
    res.json(movie);
})
app.get("/movies",(req,res)=>{
    const {genre, language, rating, releaseYear, availableOnOTT, search} = req.query;
    let filterData=movies;
    if(genre){
        filterData=filterData.filter((p)=>p.genre==genre);
    }
    if(language){
        filterData=filterData.filter((p)=>p.language==language);
    }
    if(rating){
        filterData=filterData.filter((p)=>p.rating>=rating);
    }
    if(releaseYear){
        filterData=filterData.filter((p)=>p.releaseYear>=releaseYear);
    }
    if(availableOnOTT){
        filterData=filterData.filter((p)=>p.availableOnOTT===true);
    }
    if(search){
        filterData=filterData.filter((p)=>p.title.toLowerCase()==search.toLowerCase());
    }
    res.json(filterData)
})
app.post("/movies", (req,res)=>{
    movies.push(req.body);
    res.status(201).json({
        "message": "Movie created successfully",
        "movie": req.body
    });
})
app.patch("/movies/:id",(req,res)=>{
    const data = req.body;
    const fetchMovie=movies.find((p)=>p.id==req.params.id)
    if(fetchMovie){
        Object.assign(fetchMovie,data);
        res.json({
            "message":"Movie Updated succesfully",
            "movie": fetchMovie
        })
    }
    else{
        res.status(404).send("Wrong Id");
    }
})
app.put("/movies/:id",(req,res)=>{
    const data = req.body;
    const fetchMovie=movies.find((p)=>p.id==req.params.id)
    if(fetchMovie){
        Object.assign(fetchMovie,data);
        res.json({
            "message":"Movie replaced succesfully",
            "movie": fetchMovie
        })
    }
    else{
        res.status(404).send("Wrong Id");
    }
})
app.delete("/movies/:id",(req,res)=>{
    if (!req.isAdmin) {
        return res.status(403).send("Admin access required");
    }

    const id = req.params.id;
    const index =movies.findIndex((p)=>p.id==id);
    if(index>=0){
        const p=movies.splice(index,1);
        res.json({
            "message":"Movie deleted succesfully",
            "movie": p[0]
        })

    }
    else{
        res.status(404).send("Movie not found");
    }
})
import app from "./app.js";
import connectToDatabse from "./db/connection.js";

//connections and listneres
const PORT =process.env.PORT || 1000;
connectToDatabse().then(() => {
    app.listen(PORT,() => console.log("Server Open and Connected to Database"));
})
.catch((err) => console.log(err));


//use dynamic id as router /id
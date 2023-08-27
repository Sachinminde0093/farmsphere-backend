
import App from "./app";


const app = new App([ 
    ]);

app.express.get('/', (req, res) =>{
    res.send("You Have to reach house hub server")
})


app.listen();
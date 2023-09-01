
import UserController from "./src/resources/user/user.controller";
import App from "./app";


const app = new App([ 
     new UserController(),
    ]);

app.express.get('/', (req, res) =>{
    res.sendFile(__dirname + '/index.html');
})

 

app.listen();
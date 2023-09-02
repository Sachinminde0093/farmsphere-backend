
import UserController from "./src/resources/user/user.controller";
import App from "./app";
import PostController from "./src/resources/post/post.controller";
import FileController from "./src/resources/file/file.controller";


const app = new App([ 
     new UserController(),
     new PostController(),
     new FileController()
    ]);

// app.express.get('/', (req, res) =>{
//     res.sendFile(__dirname + '/index.html');
// })
app.express.get('/', (req, res) =>{
    res.send('you have succesfully reach to farmsphere backend service');
})

 

app.listen();
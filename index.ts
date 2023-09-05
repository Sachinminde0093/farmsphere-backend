
import UserController from "./src/resources/user/user.controller";
import App from "./app";
import PostController from "./src/resources/post/post.controller";
import FileController from "./src/resources/file/file.controller";
import ChatController from "./src/resources/chat/chat.controller";


const app = new App([ 
     new UserController(),
     new PostController(),
     new FileController(),
     new ChatController(),
    ]);

// app.express.get('/', (req, res) =>{
//     res.sendFile(__dirname + '/index.html');
// })
app.express.get('/', (req, res) =>{
    res.send('you have succesfully reach to farmsphere backend service');
})

 

app.listen();
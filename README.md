## Project Initiation Steps
### **1. Perform the command ```yarn install``` inside following directories:** <br>
- Bloggie-MERN
- Bloggie-MERN\api
- Bloggie-MERN\client <br>

### **2. Inside the 'Bloggie-MERN\api' directory:** <br>
- Create a _'.env'_ file.
- Inside the _'.env'_ file, write: <br>
    <sub>CONN_STR = 'your_mongodb_connection_string'</sub> <br>
    <sub>SECRETE = 'some_key'</sub>
- Replace _'your_mongodb_connection_string'_ with the connection string of your MongoDB database instance <br>

### **3. To create a database, visit [MongoDB Atlas](https://www.mongodb.com/)** <br>

### **4. Inside the 'Bloggie-MERN\client' directory, run following commands:** <br>
- ```yarn add react-router-dom```
- ```yarn add react-quill```
- ```yarn add date-fns``` <br>

### **5. To run the app:** <br>
- Run ```nodemon index.js``` command inside _'Bloggie-MERN/api'_ directory
- Run ```yarn start``` command inside _'Bloggie-MERN/client'_ directory <br>

## Documentation 
### **1. Database Schema:**
- #### Post
  ```javascript
    const mongoose = require('mongoose');
    const {Schema,model} = mongoose;
     
    const PostSchema = new Schema({
      title:String,
      summary:String,
      content:String,
      cover:String,
      author:{type:Schema.Types.ObjectId, ref:'User'},
    }, {
      timestamps: true,
    });
  
    const PostModel = model('Post', PostSchema);  
    module.exports = PostModel;
  ```
- #### User
  ```javascript
    const mongoose = require('mongoose');
  
    const userSchema = new mongoose.Schema({
        username: {
            type: String,
            required: true,
            min: 4,
            unique: true
        },
        password: {
            type: String,
            required: true
        }
    });
  
    const UserModel = mongoose.model('User', userSchema);  
    module.exports = UserModel;
  ```

  ### **2. Routing:**
  ```javascript
    app.post('/register', async (req, res)=>{
        const {username, password} = req.body;
        try{
            const userDoc = await User.create({username, password:bcrypt.hashSync(password, salt)});
            /*alert(`Registeration Successful...\nUsername: ${userDoc.username}\nYou can login now...`);*/
            res.json(userDoc);
        }catch(e){
            res.status(400).json(e.message);
        }
    });
    
    app.post('/login', async (req, res) => {
        const {username, password} = req.body;
        const userDoc = await User.findOne({username});
        const passOk = bcrypt.compareSync(password, userDoc.password);
        if(passOk){
            jwt.sign({username, id:userDoc._id}, secrete, {}, (err, token) => {
                if(err) throw err;
                res.cookie('token', token).json({
                    id: userDoc._id,
                    username
                });
            });
        }else{
            res.status(400).json('Wrong Credentials...');
        }
    });
    
    app.get('/profile', (req, res) => {
        const {token} = req.cookies;
        jwt.verify(token, secrete, {}, (err, info) => {
            if(err) throw err;
            res.json(info);
        });
    });
    
    app.post('/logout', (req, res) => {
        res.cookie('token', '').json('ok')
    });
    
    app.post('/post', uploadMiddleware.single('file'), async (req,res) => {
        const {originalname,path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length - 1];
        const newPath = path+'.'+ext;
        const newPath1 = newPath.substring(0, 7)+ '/' +newPath.substring(8, newPath.length);
        fs.renameSync(path, newPath1);
      
        const {token} = req.cookies;
        jwt.verify(token, secrete, {}, async (err,info) => {
          if (err) throw err;
          const {title,summary,content} = req.body;
          const postDoc = await Post.create({
            title,
            summary,
            content,
            cover:newPath1,
            author:info.id,
          });
          res.json(postDoc);
        });  
    });
    
    app.get('/post', async (req,res) => {
        res.json(
          await Post.find()
            .populate('author', ['username'])
            .sort({createdAt: -1})
            .limit(20)
        );
    });
    
    app.put('/post',uploadMiddleware.single('file'), async (req,res) => {
        let newPath = null;
        let newPath1 = null;
    
        if (req.file) {
          const {originalname,path} = req.file;
          const parts = originalname.split('.');
          const ext = parts[parts.length - 1];
          newPath = path+'.'+ext;
          newPath1 = newPath.substring(0, 7)+ '/' +newPath.substring(8, newPath.length);
          fs.renameSync(path, newPath1);
        }
    
        const {token} = req.cookies;
        jwt.verify(token, secrete, {}, async (err,info) => {
          if (err) throw err;
          const {id,title,summary,content} = req.body;
          const postDoc = await Post.findById(id);
          const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
          if (!isAuthor) {
            return res.status(400).json('you are not the author');
          }
          await postDoc.updateOne({
            title,
            summary,
            content,
            cover: newPath1 ? newPath1 : postDoc.cover,
          });  
          res.json(postDoc);
        });
    });
    
    app.get('/post/:id', async (req, res) => {
        const {id} = req.params;
        const postDoc = await Post.findById(id).populate('author', ['username']);
        res.json(postDoc);
    });
  ```

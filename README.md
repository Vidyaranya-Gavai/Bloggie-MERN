## Bloggie
##### ***A MERN Stack based blog web application enabling users to register & login and perform CRUD (Create, Read, Update, Delete) operation on blogs.***
##### ***Implemented user authentication and authorization using technologies such as 'Bcrypt' and 'JWT' to ensure seamless routing.***

##### <ins>***Skills: MongoDB, ExpressJS, ReactJS, NodeJS***</ins>

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
- Run ```yarn start``` command inside _'Bloggie-MERN/client'_ directory
- The application will run on http://localhost:3000

## Documentation 
### **Models:**
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
<br>

### After running the app, it should look like this:
| Before Login                            | After login                           |
| --------------------------------------- | ------------------------------------- |
|![image](https://github.com/Vidyaranya-Gavai/Bloggie-MERN/assets/114799492/e811a6be-f6ea-4407-bb40-751b22857ccb)|![image](https://github.com/Vidyaranya-Gavai/Bloggie-MERN/assets/114799492/944285de-4c94-41d3-9110-7965131e85d4)|

| Login Page                               | Register Page                         |
| ---------------------------------------- | ------------------------------------- |
|![image](https://github.com/Vidyaranya-Gavai/Bloggie-MERN/assets/114799492/fe443281-4af2-4084-8ba7-69de230426de)|![image](https://github.com/Vidyaranya-Gavai/Bloggie-MERN/assets/114799492/35ef36f6-0701-4131-90a9-4132e175e756)|

| Post by loggen in user                   | Post by different user                |
| ---------------------------------------- | ------------------------------------- |
|![image](https://github.com/Vidyaranya-Gavai/Bloggie-MERN/assets/114799492/0b9b3907-9918-44e4-88fa-3d09067dfd14)|![image](https://github.com/Vidyaranya-Gavai/Bloggie-MERN/assets/114799492/47bb5952-34fd-4c92-baf6-277bdca9eaf4)|

| Create Post                              | Edit Post                             |
| ---------------------------------------- | ------------------------------------- |
|![image](https://github.com/Vidyaranya-Gavai/Bloggie-MERN/assets/114799492/8194ccff-05e1-4ab6-8dcb-23fd14be1db2)|![image](https://github.com/Vidyaranya-Gavai/Bloggie-MERN/assets/114799492/dfa674dd-3c27-41b5-87be-e0f33c5ad9f0)|

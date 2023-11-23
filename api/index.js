const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const multer = require('multer');
const uploadMiddleware = multer({ dest: 'uploads/' });
const fs = require('fs');

const Post = require('./models/Post');
const User = require('./models/User');

require('dotenv').config();

const app = express();
const salt = bcrypt.genSaltSync(10);
const secrete = process.env.SECRETE;

app.use(cors({credentials:true, origin:'http://localhost:3000'}));
app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(__dirname + '/uploads'));

const conn_str = process.env.CONN_STR;
mongoose.connect(conn_str);

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

app.listen(4000);
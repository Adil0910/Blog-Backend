const express = require('express');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const User = require('./models/userModel');
const Blog = require('./models/blogModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

function auth(req,res,next){
    let token = req.headers.authorization.split(' ')[1];
    // 2️⃣ Token exist karta hai ya nahi
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied"
      });
    }

    let decoded = jwt.verify(token,'chacha');

    req.user = decoded;
    next();


}

app.get('/', (req, res) => {
    res.send('Server is running')
});
app.get('/all-user', async (req, res) => {
    let all = await User.find();
    res.json({
        success: true,
        users: all
    })
});

app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        };
        let salt = await bcrypt.genSalt();
        let hashedPass = await bcrypt.hash(password, salt)

        const user = await User.create({ name, email, password: hashedPass });

        res.json({
            success: true,
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
});


app.post('/create-blog', auth ,async (req, res) => {
    try {
        const { image, title, content, author } = req.body;
        console.log(req.user)
        
        let blog = await Blog.create({
            image,
            title,
            content,
            author : req.user.userData._id
        });
        res.json({
            success: true,
            blog
        })
    } catch (error) {
        console.log(error)
    }
});

app.get('/all-blog', async (req, res) => {
    let blogs = await Blog.find().populate('author', '-password')
    res.json({
        success: true,
        blogs
    })
})

app.get('/blog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const blog = await Blog.findById(id).populate('author', "-password")
        if (!blog) {
            return res.json({
                success: false,
                message: "Blog not Found"
            })
        }
        res.json({
            success: true,
            blog
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
})

app.put('/blog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, content, image } = req.body;
        const updatedBlog = await Blog.findByIdAndUpdate(
            id,
            { title, content, image },
            { new: true }
        );
        if (!updatedBlog) {
            return res.json({
                success: false,
                message: "blog not found"
            })
        }
        res.json({
            success: true,
            message: updatedBlog
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        })
    }
});


app.delete('/blog/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBlog = await Blog.findByIdAndDelete(id);
        if (!deletedBlog) {
            return res.json({
                success: false,
                message: "blog not found"
            })
        }
        res.json({
            success: true,
            message: "Blog Deleted"
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: "false",
            message: "Server Error"
        })
    }

})


app.get('/user/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id).select('-password')
        if (!user) {
            return res.json({
                success: false,
                message: "user not found"
            })
        }
        res.json({
            success: true,
            user
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: true,
            message: "Server Error"
        })

    }
})
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.json({ success: false, message: "User not found" });
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
        return res.json({ success: false, message: "Invalid password" });
    }

    const userData = {
        _id: user._id,
        name: user.name,
        email: user.email
    };

    let token = jwt.sign({ userData }, 'chacha', { expiresIn: '1h' })

    res.json({
        success: true,
        message: "Login successful",
        user: userData,
        token
    });
});

app.get('/user/:userId/blogs', async (req, res) => {
    try {
        const { userId } = req.params;
        const blogs = await Blog.find({ author: userId })
            .populate('author', '-password');

        res.json({
            success: true,
            blogs
        })

    } catch (error) {
        console.error("error", error)
    }
})

app.listen(3000, function () {
    console.log('Server running on Port - 3000')
})




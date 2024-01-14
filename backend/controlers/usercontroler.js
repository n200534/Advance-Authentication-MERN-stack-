const User = require('../model/Usermodel')
const bcrypt = require('bcrypt');
const router = require('../routes/userroutes');
const jwt = require("jsonwebtoken")
const JWT_Secret_key = 'my key '
const signup = async (req, res, next) => {
    const { name, email, password } = req.body

    //checking if user exixts
    let existingUser;
    try {
        existingUser = await User.findOne({ email: email });
    } catch (error) {
        console.log(error);
    }
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" })
    }
    //protecting the passwords
    let hashedPassword = await bcrypt.hashSync(password, 10);



    const user = new User({

        name,
        email,
        password: hashedPassword,
    });
    try {
        await user.save();
    }
    catch (err) {
        console.log(err)

    }
    return res.status(201).json({ messsage: user });
}

//login route

const login = async (req, res, next) => {
    const { email, password } = req.body;
    var existingUser;
    try {
        existingUser = await User.findOne({ email: email })
    } catch (error) {
        return new Error(error)

    }
    if (!existingUser) {
        res.status(400).json({ message: 'NO User found please signup' })
    }

    //checking the password
    const ispasswordcorrect = bcrypt.compareSync(password, existingUser.password)
    if (!ispasswordcorrect) {
        return res.status(400).json({ message: "Wrong Password" })
    }
    const token = jwt.sign({ id: existingUser.id }, JWT_Secret_key, {
        expiresIn: "30s"
    })

    console.log("Genrated token \n",token)
    if(req.cookies[`${existingUser.id}`]){
        req.cookies[`${existingUser.id}`]=""
    }


    //http only cookies
    let jwtToken = String(existingUser.id)
    res.cookie(jwtToken, token, {
        path: '/',
        expires: new Date(Date.now() + 1000 * 600),
        httpOnly: true,
        sameSite: "lax"
    })
    return res
        .status(200)
        .json({ message: "SuccessFully Logged In", user: existingUser, token })
}

const verifyToken = (req, res, next) => {

    const token = req.cookies && req.cookies.jwtToken;



    console.log(token)
    if (!token) {
        res.status(400).json({ message: "NO token" })
    }
    jwt.verify(String(token), JWT_Secret_key, (err, decodedUser) => {
        if (err) {
            return res.status(400).json({ message: "Invalid Token" })
        }
        console.log(decodedUser.id)
        req.id = decodedUser.id;


    })
    next();
}

const getUser = async (req, res, next) => {
    const userId = req.id;
    let user;
    try {
        user = await User.findById(userId, "password")
    } catch (err) {
        return new Error(err);
    }
    if (!user) {
        return res.status(400).json({ message: "User NOt found" })
    }

    return res.status(200).json({ user })

}

const refreshToken = (req, res, next) => {
    const cookie = req.headers.cookie;
    const prevtoken = cookie.split('')[1];
    if (!prevtoken) {
        return res.status(400).json({ message: "couldnot find the token" })
    }
    jwt.verify(String(prevtoken), JWT_Secret_key, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Authentication failed" })
        }
        res.clearCookie(`${user.id}`);
        req.cookie[`${user.id}`] = '';

        //genrating the new token
        const token = jwt.sign({ id: user.id }, JWT_Secret_key, {
            expiresIn: '30s'
        })

        console.log('Regenrated token \n',token)
        let jwtToken = String(user.id)

        res.cookie(jwtToken, token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 600),
            httpOnly: true,
            sameSite: "lax"
        });
        req.id=user.id
        next();
    })
}



module.exports.signup = signup;
module.exports.login = login;
module.exports.verifyToken = verifyToken;
module.exports.getUser = getUser;
module.exports.refreshToken=refreshToken;
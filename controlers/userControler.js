const jwt = require("jsonwebtoken");
const UserModel = require('../models/userModel');
const bcrypt = require("bcrypt");
const SALTS = 10;

function handleServerError(err, res) {
    console.log(err);
    return res.sendStatus(500);
}

const JWT_SECRET = process.env.JWT_SECRET

function readToken(req){
    let authorization = req.headers.authorization;
    if (!authorization) return null;
    let splitted = authorization.split("");
    let token = splitted[1];
    if (token) return token;
    else return null;
}

const UserControler = {

    /* BONUS MIDDLEWARES IF NEED TO LOG BODY OR WANT TO TRY ADMIN SYSTEM */
    logBody(req, res, next){
        console.log(req.body);
        next();
    },

    isAdmin(req, res, next){
        if (req.user.role === "admin"){
            return res.send(200);
        }
        return res.send(403)
    },

    /* MIDDLEWARE TO CHECK IF USER CAN ACCESS PRIVATE ROUTES */
    isUser(req, res, next){
        let token = readToken(req);
        if (token === null) return res.sendStatus(401);
        jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
            if (err) return res.sendStatus(400);
            let _id = decodedToken._id;
            UserModel.findOne({_id:_id}).then((dbResponse) => {
                if (dbResponse === null ) return sendStatus(404);
                req.user = dbResponse;
                next();
            })
        })
    },

    getInfos(req, res, next){
        res.send(req.user);
    },

    testPrivateController(req, res, next) {
        console.log(`USER FIRST NAME IS : ${req.user.firstname}`);
        res.send("Test Virginie Controler was successfull ! lets go !");
    },

     /* ************* PUBLIC ROUTES **************** */

     /* LOGIN */

    login(req,res, next){
        const userInfos = req.body;
        const email = userInfos.email;
        const password = userInfos.password;

        if(!email || !password){
            return res.status(400).send("Merci de remplir les champs")
        }
        return UserModel.findOne({email: email})
            .then((user)=>{
                if (user === null){
                    console.log("email incorrect");
                    return res 
                        .status(404)
                        .send("Informations de connexion incorrectes");
                }

                let passwordsDoMatch = bcrypt.compareSync(password, user.password);
                if (!passwordsDoMatch){
                    console.log("incorrect password")
                    return res
                        .status(404)
                        .send("Informations de connexion incorrectes");
                }
                jwt.sign({_id:user._id}, JWT_SECRET, (err, token)=>{
                    if (err) console.log(err);
                    res.status(200).send({token:token, success:true, message:"Login successfull my friends"});
                });
            })
            .catch((err)=> handleServerError(err, res));
    },

    /* SIGNUP PUBLIC ROUTE */

    signup(req, res, next){
        let {
            firstName, 
            lastName,
            email,
            password,
            confirmPassword,
            stableCoins,
        } = req.body;
        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            return res.status(400).send('Les champs obligatoires ne sont pas tous remplis');
        }
        if (password != confirmPassword){
            return res.status(400).send('Les mots de passe saisis ne sont pas identiques');
        }
        return UserModel.findOne({email: email})
            .then((alreadyExistingUser)=>{
                if (alreadyExistingUser === null) {
                    let hashedPassword = bcrypt.hashSync(password, SALTS);
                    
                    return UserModel.create({
                        firstName: firstName,
                        lastName: lastName, 
                        email:email,
                        password: hashedPassword,
                        stableCoins:stableCoins,
                    })
                        .then((newUser)=> {
                            jwt.sign(
                                {_id:newUser._id },
                                JWT_SECRET,
                                (err,token) => {
                                    if (err) console.log(err);
                                    console.log(token);
                                    res.status(200).send({token, success:true, message:"Signup successfull my friends"});
                                }
                            );
                        })
                        .catch((err)=> handleServerError(err, res));
                }
                return res
                    .status(400)
                    .send("Un compte est déjà enregistré avec cette adresse e-mail");
            })
            .catch((err) => handleServerError(err, res));
    },
}

module.exports = UserControler;
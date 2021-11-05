const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const SALTS = 10;


function handleServerError(err, res) {
  console.log(err);
  return res.sendStatus(500);
}

const JWT_SECRET = process.env.JWT_SECRET;

function readToken(req) {
  let authorization = req.headers.authorization;
  if (!authorization) return null;
  let splitted = authorization.split(" ");
  let token = splitted[1];
  if (token) return token;
  else return null;
}

const UserControler = {
  /* BONUS MIDDLEWARES IF NEED TO LOG BODY OR WANT TO TRY ADMIN SYSTEM */
  logBody(req, res, next) {
    console.log(req.body);
    next();
  },

  isAdmin(req, res, next) {
    if (!req.user.admin) {
      return res.status(200).send({ success: true, message: "Ok" });
    }
    return res
      .status(403)
      .send({ succes: false, message: "N'est pas un admin" });
  },

  /* MIDDLEWARE TO CHECK IF USER CAN ACCESS PRIVATE ROUTES */

  getInfos(req, res, next) {
    return res
      .status(200)
      .send({ success: true, message: "Info utilisateur", data: req.user });
  },

  testPrivateController(req, res, next) {
    console.log(`USER FIRST NAME IS : ${req.user.firstname}`);
    res.send({
      success: true,
      message: "Test Virginie Controler was successfull ! lets go !",
    });
  },

  /* ************* PUBLIC ROUTES **************** */

  /* LOGIN */

  login(req, res, next) {
    const userInfos = req.body;
    const email = userInfos.email;
    const password = userInfos.password;

    if (!email || !password) {
      return res
        .status(400)
        .send({ success: false, message: "Merci de remplir les champs" });
    }
    return UserModel.findOne({ email: email })
      .then((user) => {
        if (user === null) {
          console.log("email incorrect");
          return res.status(403).send({
            success: false,
            message: "Informations de connexion incorrectes",
          });
        }

        let passwordsDoMatch = bcrypt.compareSync(password, user.password);
        if (!passwordsDoMatch) {
          console.log("incorrect password");
          return res.status(401).send({
            success: false,
            message: "Informations de connexion incorrectes",
          });
        }
        jwt.sign(
          { _id: user._id },
          JWT_SECRET,
          { expiresIn: "24h" },
          (err, token) => {
            if (err) console.log(err);
            res.status(200).send({
              token: token,
              success: true,
              message: "Login successfull my friends",
            });
          }
        );
      })
      .catch((err) => handleServerError(err, res));
  },

  /* SIGNUP PUBLIC ROUTE */

  signup(req, res, next) {
    let { firstName, lastName, email, password, confirmPassword, country, userName} = req.body;
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Les champs obligatoires ne sont pas tous remplis",
      });
    }
    if (password != confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Les mots de passe saisis ne sont pas identiques",
      });
    }
    return UserModel.findOne({ email: email })
      .then((alreadyExistingUser) => {
        if (alreadyExistingUser === null) {
          let hashedPassword = bcrypt.hashSync(password, SALTS);

          return UserModel.create({
            firstName: firstName,
            lastName: lastName,
            userName: userName,
            email: email,
            password: hashedPassword,
            stableCoin: 0,
            infos:{
              isAdmin:false,
              isVerified: "a finaliser",
              phoneNumber:"",
              dateOfBirth:"",

              adress:"",
              city:"",
              postalCode:"",
              country:country,

            }
          })
            .then((newUser) => {
              jwt.sign(
                { _id: newUser._id },
                JWT_SECRET,
                { expiresIn: "24h" },
                (err, token) => {
                  if (err) console.log(err);
                  console.log(token);
                  res.status(200).send({
                    token: token,
                    success: true,
                    message: "Signup successfull my friends",
                  });
                }
              );
            })
            .catch((err) => handleServerError(err, res));
        }
        return res.status(400).send({
          success: false,
          message: "Un compte est déjà enregistré avec cette adresse e-mail",
        });
      })
      .catch((err) => handleServerError(err, res));
  },

  /* EDIT USER INFOS  */
  editUser(req, res, next) {
    let { phoneNumber, adress, city, postalCode, dateOfBirth, country } = req.body;
    if (!phoneNumber || !adress || !city || !postalCode || !dateOfBirth || !country) {
      return res.status(400).send({
        success: false,
        message: "Les champs obligatoires ne sont pas tous remplis."
      });
    }
    UserModel.updateOne(
      { _id: req._id }, //filtre
      {
        infos: {
          phoneNumber: phoneNumber, //a changer
          dateOfBirth: dateOfBirth,
          adress: adress,
          city: city,
          postalCode: postalCode,
          country: country,
        },
      }
    )
      .then(() => {
        res
          .status(200)
          .send({
            success: true,
            message:
              "vos informations sont en attente de validation par un administrateur",
          });
      })
      .catch(() => {
        res
          .status(400)
          .send({ success: false, message: "Erreur modification" });
      });
  },



  editUserCoin(req, res, next) {
    let {operationValue} = req.body;
    let operationValueInNumber = parseInt(operationValue)
    let userCoinBalanceBeforeOperationInNumber = parseInt(req.user.stableCoin);
    let userCoinBalanceAfterOperation = userCoinBalanceBeforeOperationInNumber + operationValueInNumber;

    /* LOGS FOR DEBUG & EDUCATIONAL PURPOSES // WILL BE REMOVED */
    console.log("first",userCoinBalanceAfterOperation, typeof(userCoinBalanceAfterOperation),
    "second", operationValue,
    "userCoinInNumber",userCoinBalanceAfterOperation,
    "third", req.user.stableCoin,
    "req.user._id", req.user._id,
    "opcalueinNumber",operationValueInNumber,typeof(operationValueInNumber),
    "type", typeof(operationValue));
    
    
    if (!operationValue || userCoinBalanceAfterOperation < 0) {
      return res.status(400).send({
        success: false,
        message: `Les champs obligatoires ne sont pas tous remplis.  Ou l'opération n'est pas authorisée. Le solde de l'utilisateur reste de ${req.user.stableCoin}`,
      });
      
    }
    UserModel.updateOne(
      { _id: req.user._id },
      { stableCoin: userCoinBalanceAfterOperation }
    )
      .then(() => {
        res
          .status(200)
          .send({
            success: true,
            message: `ok new user Balance is ${userCoinBalanceAfterOperation} `,
          });
      })
      .catch(() => {
        res
          .status(400)
          .send({
            success: false,
            message: "Erreur modification",
            debug: `${req.user._id}`,
          });
      });
  },

  editUserYourChoice(req, res, next){
    let {pathOfKeyToEdit, incomingChangeValue} = req.body;

    /* function exist(collection, target, id) {
      const Model = require(`../models/${collection}`);
      let queryParam = {};
      queryParam[target] = id;
      return Model.find(queryParam).then((data) => {
        if (data.length > 0) {
          return true;
        }
        return false;
      });
    } */

    /* Utilisateur.updateOne(
      { _id: req.body._id }, //filtre
      {
        pseudo: req.body.pseudo, //a changer
        age: req.body.age,
        genre: req.body.genre,
        bio: req.body.bio,
      }
    )
      .then(function () {
        res.send({ success: true, message: "Modification" });
      })
      .catch(function () {
        res.status(400).send({ success: false, message: "Erreur modification" });
      }); */


    console.log(pathOfKeyToEdit, incomingChangeValue)

  },

  filesProof(req, res, next) {
    console.log("files",req.files);
    console.log("body",req.body);
   /*  infos:{
      isVerified: "a verifier", */
  }
};

module.exports = UserControler;

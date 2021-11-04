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
  isUser(req, res, next) {
    let token = readToken(req, res);
    console.log(token, "test", JWT_SECRET);
    if (token === null)
      return res
        .status(401)
        .send({ succes: false, message: "Pas de connexion" });
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      console.log(err, decodedToken);
      if (err)
        return res
          .status(400)
          .send({ succes: false, message: "Erreur sur le Token" });
      let _id = decodedToken._id;
      UserModel.findOne({ _id: _id }).then((dbResponse) => {
        if (dbResponse === null)
          return res
            .status(404)
            .send({ succes: false, message: "Pas d'utilisateur associé" });
        req.user = dbResponse;
        req._id = decodedToken._id;
        next();
      });
    });
  },

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
          return res.status(404).send({
            success: false,
            message: "Informations de connexion incorrectes",
          });
        }

        let passwordsDoMatch = bcrypt.compareSync(password, user.password);
        if (!passwordsDoMatch) {
          console.log("incorrect password");
          return res.status(404).send({
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
    let { firstName, lastName, email, password, confirmPassword } =
      req.body;
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
            email: email,
            password: hashedPassword,
            stableCoins: 0,
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
    let { phoneNumber, adress, city, postalCode, dateOfBirth } = req.body;
    if (!phoneNumber || !adress || !city || !postalCode || !dateOfBirth) {
      return res.status(400).send({
        success: false,
        message: "Les champs obligatoires ne sont pas tous remplis",
      });
    }
    UserModel.updateOne(
      { _id: req._id }, //filtre
      { info: {
        phoneNumber: phoneNumber, //a changer
        adress: adress,
        city: city,
        postalCode: postalCode,
        dateOfBirth: dateOfBirth,}
      }
    )
      .then(() => {
        res.status(200).send({ success: true, message: "Modification" });
      })
      .catch(() => {
        res
          .status(400)
          .send({ success: false, message: "Erreur modification" });
      });
  },


  editUserCoin(req, res, next) {
    let { operationValue } = req.body;
    if (!operationValue) {
      return res.status(400).send({
        success: false,
        message: "Les champs obligatoires ne sont pas tous remplis",
      });
    }
    UserModel.updateOne(
      { _id: req._id }, 
      { info: {
        stableCoin: (stableCoin + operationValue),
        }
      }
    )
      .then(() => {
        res.status(200).send({ success: true, message: "Modification effectuée" });
      })
      .catch(() => {
        res
          .status(400)
          .send({ success: false, message: "Erreur modification" });
      });
  },
};

module.exports = UserControler;

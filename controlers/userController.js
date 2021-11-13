const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const ItemFundingModel = require("../models/itemFundingModel");
const SALTS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

function handleServerError(err, res) {
  console.log("LOG PROVIDED BY HANDLE SERV ERROR FUNCTION :", err);
  return res.sendStatus(500);
}

/* ******* USER CONTROLLERS SUMMARY ******* */
/* I.PUBLIC CONTROLLERS 
  A. SIGNUP 
  B. LOGIN 

II.PRIVATE USER CONTROLLERS
  A. EDIT USER // Allows the user to send additional personnal informations to request Verified status.
  B. EDIT USER COINS // Allows the user to send a buy order for stable coins OR to request his coins to be wired back to his account 

III.PRIVATE ADMIN CONTROLLERS */

const UserController = {
  /* I // ********* PUBLIC CONTROLLERS ********* */
  /* A // SIGNUP ******************************** */

  signup(req, res, next) {
    let {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      country,
      userName,
      isAdmin,
    } = req.body;

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
            userName: !userName ? "" : userName,
            email: email,
            password: hashedPassword,
            stableCoin: 0,
            infos: {
              isAdmin: !isAdmin ? "false" : isAdmin,
              hasProvidedAllDocuments: false,
              isVerifiedByAdmin: false,
              phoneNumber: "",
              dateOfBirth: "",

              adress: "",
              city: "",
              postalCode: "",
              country: !country ? "" : country,
            },
            documents: {
              status: {
                hasProvidedDocumentsForReview: false,
                hasProvidedValidIdCard: false,
                hasProvidedValidBankDetails: false,
                hasProvidedValidProofOfAdress: false,
              },
              documentsUrl: [],
            },
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

  /* I // ********* PUBLIC CONTROLLERS ********* */
  /* B // LOGIN ******************************** */

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


  /* I // ******* PRIVATE USER CONTROLLERS ***** */
  /* A // EDIT USER **************************** */

  editUser(req, res, next) {
    let {
      userName,
      phoneNumber,
      dateOfBirth,
      adress,
      city,
      postalCode,
      country,
    } = req.body;
    if (!phoneNumber || !adress || !city || !postalCode || !dateOfBirth) {
      return res.status(400).send({
        success: false,
        message: "Les champs obligatoires ne sont pas tous remplis.",
      });
    }
    UserModel.updateOne(
      { _id: req._id },
      {
        userName: userName,
        infos: {
          isVerifiedByAdmin: req.user.infos.isVerifiedByAdmin,
          hasProvidedAllDocuments: req.user.infos.hasProvidedAllDocuments,
          isAdmin: req.user.infos.isAdmin,
          isVerified: req.user.infos.isVerified,
          phoneNumber: phoneNumber,
          dateOfBirth: dateOfBirth,

          adress: adress,
          city: city,
          postalCode: postalCode,
          country: country,
        },
        ownedItems: [{ itemId: "", tokenQuantity: 0, purchaseDate: "" }],
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Vos modifications ont bien été effectuées.",
        });
      })
      .catch((err) => {
        res
          .status(400)
          .send({ success: false, message: "Erreur modification" });
      });
  },



  logBody(req, res, next) {
    console.log(req.body);
    next();
  },

  getInfos(req, res, next) {
    return res
      .status(200)
      .send({ success: true, message: "Info utilisateur", data: req.user });
  },

  stockDocument(req, res, next) {
    const myArray = req.myArray;
    console.log(myArray);
    if (!myArray) {
      return res
        .status(400)
        .send({ success: false, message: "Champs néccessaires non indiqués" });
    }
    return UserModel.updateOne(
      { _id: req._id },
      {
        $push: {
          "documents.documentsUrl": myArray,
        },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message:
            "Ok vos documents ont bien été envoyés. L'équipe d'UpDownStreet vérifiera vos documents sous 48h.",
        });
      })
      .catch(() => {
        res.status(400).send({
          success: false,
          message: "Erreur",
          debug: `${req.user._id}`,
        });
      });
  },

  

  /* EDIT USER INFOS  */
  

  editUserTry(req, res, next) {
    let { editValue, keyToEdit } = req.body;

    if (!editValue) {
      return res.status(400).send({
        success: false,
        message: "Les champs obligatoires ne sont pas tous remplis.",
      });
    }
    UserModel.updateOne(
      { _id: req._id },
      {
        $set: {
          [keyToEdit]: "WOOOOO",
        },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Vos modifications ont bien été effectuées.",
        });
      })
      .catch((err) => {
        res
          .status(400)
          .send({ success: false, message: "Erreur modification" });
      });
  },

  editUserCoin(req, res, next) {
    let { operationValue } = req.body;
    let operationValueInNumber = parseInt(operationValue);
    let userCoinBalanceBeforeOperationInNumber = parseInt(req.user.stableCoin);
    let userCoinBalanceAfterOperation =
      userCoinBalanceBeforeOperationInNumber + operationValueInNumber;

    if (!operationValue || userCoinBalanceAfterOperation < 0) {
      return res.status(400).send({
        success: false,
        message: `Les champs obligatoires ne sont pas tous remplis.  Ou l'opération n'est pas authorisée. Le solde de l'utilisateur reste de ${req.user.stableCoin}`,
      });
    }
    return UserModel.updateOne(
      { _id: req.user._id },
      { stableCoin: userCoinBalanceAfterOperation }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: `ok new user Balance is ${userCoinBalanceAfterOperation}`,
        });
      })
      .catch(() => {
        res.status(400).send({
          success: false,
          message: "Erreur modification",
          debug: `${req.user._id}`,
        });
      });
  },

  editUserAdminStatus(req, res, next) {
    let { targetUserId, keyOfPropertyToChange, targetValue } = req.body;
    if (!targetUserId || !keyOfPropertyToChange || !targetValue) {
      return res.status(400).send({
        success: false,
        message: "Nope nope nope nope. No user Info",
        logOfInputValue: `Log it bb. ${targetUserId}, ${keyOfPropertyToChange} ${targetValue}`,
      });
    }
    return UserModel.updateOne(
      { _id: targetUserId },

      {
        $set: {
          [keyOfPropertyToChange]: targetValue,
        },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: `User successfully changed. User with _id : ${targetUserId}. ${keyOfPropertyToChange} is now ${targetValue}`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: `Did not go well. User ${keyOfPropertyToChange} status wasn't changed to ${targetValue}. ${targetUserId} Err Log : ${err}`,
        });
      });
  },

  testPrivateController(req, res, next) {
    console.log(`USER FIRST NAME IS : ${req.user.firstName}`);
    return res.send({ success: true, message: "allgood with controller" });
  },

  filesProof(req, res, next) {
    console.log("je suis ici");
    console.log("files", req.files);
    console.log("body", req.body);
    /*  infos:{
      isVerified: "a verifier", */
  },
};

module.exports = UserController;

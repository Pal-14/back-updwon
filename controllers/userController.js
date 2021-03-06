const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const SALTS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

function handleServerError(err, res) {
  console.log("LOG PROVIDED BY HANDLE SERV ERROR FUNCTION :", err);
  return res.sendStatus(500);
}

/* ************************************************************************** */
/* ********* ********** *** USER CONTROLLERS SUMMARY *** ********** ********* */
/* ************************************************************************** */ /*

I.PUBLIC CONTROLLERS 
  A. SIGNUP 
    // signup //
    //
    // Debate : Should we add a gender info ? So we can talk to the user saying Mr or Mrs ? 
    
  B. LOGIN 
    // login // 

II.PRIVATE USER CONTROLLERS
  A. EDIT USER : User can send additional personnal informations to request Verified status.
     // requestVerifiedStatus // 
     // TODO : Implement findOneAndUpdate
     // Debate : Maybe rename controller into something more explicit. userProvideAdditionnalInfos or smth tbh imho imo nvm

  B. EDIT USER COINS : User can send a buy order for stable coins OR to request his coins to be wired back to his account 
    // editUserCoin // 
    // TODO : Swap updateOne for updateAndFindOne so we can send back the actual updated info from the user.
    TODO IF WE HAVE TIME : 
     Create THREE CONTROLLERS and appropriate routes 
      ==> BUY COIN WITH CREDITCARD
      ==> BUY COIN USING BANK TRANSFER
      ==> CONVERT COIN IN EUROS AND RECEIVE BANK TRANSFER

    // Debate : Maybe create two separate routes for buy and sell orders. Or have different responses and actions. 

  C. EDIT USER BY USER ANY VALUE 
    // editUserByUserAnyValue //
    // TODO : Add "keyOfPropertyToChange" controls to prevent user from granting himself an admin status or tokens. 

  D. STOCK USER DOCUMENT 
    // stockUserDocument //

  E. GET INFOS 
    // getInfos //
    // Debate : Should we keep this road or can we use the Auth.isUser route instead ? 


III.PRIVATE ADMIN CONTROLLERS
  A. EDIT USER BY ADMIN ANY VALUE 
      // editUserByAdminAnyValue //
      // TODO : Add "keyOfPropertyToChange" and/or "targetUserId" controls so he cant remove adminStatus from other Admins. Also cant change user _id
      // Debate : Should we create a superAdmin category ? So he can remove and grant admin rights. 

  B. GET USER LIST 


  C. PRIVATE CONTROLLER TEST
    // testPrivateController //
    // Debate : Should we move it to another generalControllers file ?
  

      





/* ************************************************************************** */
/* ********* ********** PART I : PUBLIC USER CONTROLLERS ********** ********* */
/* ************************************************************************** */

/* I // ********* PUBLIC CONTROLLERS ********** */
/* A // SIGNUP ******************************** */

const UserController = {
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
                  res.status(200).send({
                    token: token,
                    success: true,
                    message:
                      "F??licitation ! Vous ??tes d??sormais inscrit chez UpDownStreet ",
                  });
                }
              );
            })
            .catch((err) => handleServerError(err, res));
        }
        return res.status(400).send({
          success: false,
          message: "Un compte est d??j?? enregistr?? avec cette adresse e-mail",
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
          return res.status(403).send({
            success: false,
            message: "Informations de connexion incorrectes",
          });
        }

        let passwordsDoMatch = bcrypt.compareSync(password, user.password);
        if (!passwordsDoMatch) {
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


  

  /* ************************************************************************** */
  /* ********* ********* PART II : PRIVATE USER CONTROLLERS ********* ********* */
  /* ************************************************************************** */

  /* II // ******* PRIVATE USER CONTROLLERS **** */
  /* A // REQUEST VERIFIED STATUS ************** */

  requestVerifiedStatus(req, res, next) {
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
    return UserModel.updateOne(
      { _id: req._id },
      { $set : {
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
    }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: "Vos modifications ont bien ??t?? effectu??es.",
        });
      })
      .catch((err) => {
        res
          .status(400)
          .send({ success: false, message: "Erreur modification" });
      });
  },

  /* II // ******* PRIVATE USER CONTROLLERS **** */
  /* B // EDIT USER COIN *********************** */

  editUserCoin(req, res, next) {
    let { operationValue } = req.body;
    let operationValueInNumber = parseInt(operationValue);
    let userCoinBalanceBeforeOperationInNumber = parseInt(req.user.stableCoin);
    let userCoinBalanceAfterOperation =
      userCoinBalanceBeforeOperationInNumber + operationValueInNumber;

    if (!operationValue || userCoinBalanceAfterOperation < 0) {
      return res.status(400).send({
        success: false,
        message: `Les champs obligatoires ne sont pas tous remplis.  Ou l'op??ration n'est pas authoris??e. Le solde de l'utilisateur reste de ${req.user.stableCoin}`,
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

  /* II // ******* PRIVATE USER CONTROLLERS **** */
  /* C // EDIT USER BY USER ANY VALUE ********** */

  editUserByUserAnyValue(req, res, next) {
    let { keyOfPropertyToChange, newValue } = req.body;
    if (!keyOfPropertyToChange || keyOfPropertyToChange === "infos.isVerifiedByAdmin" || keyOfPropertyToChange === "infos.isAdmin" || newValue === undefined || newValue === "stableCoin") {
      return res.status(400).send({
        success: false,
        message:
          "Les informations n??ccessaires ?? la bonne ex??cution de la requ??te n'ont pas ??t?? re??ues.",
        logOfInputValue: `Log it . ${targetUserId}, ${keyOfPropertyToChange} ${newValue}`,
      });
    }
    return UserModel.updateOne(
      { _id: req.user._id },
      {
        $set: {
          [keyOfPropertyToChange]: newValue,
        },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: `User successfully changed. User with _id : ${targetUserId}. ${keyOfPropertyToChange} is now ${newValue}`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: `Did not go well. User ${keyOfPropertyToChange} status wasn't changed to ${newValue}. ${targetUserId} Err Log : ${err}`,
        });
      });
  },

  /* II // ******* PRIVATE USER CONTROLLERS **** */
  /* D // STOCK USER DOCUMENT ****************** */

  stockUserDocument(req, res, next) {
    const myArray = req.myArray;
    if (!myArray) {
      return res
        .status(400)
        .send({
          success: false,
          message: "Champs n??ccessaires non renseign??s",
        });
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
            "Ok vos documents ont bien ??t?? envoy??s. L'??quipe d'UpDownStreet v??rifiera vos documents sous 48h.",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: `Erreur : ${err}`,
        });
      });
  },

  /* II // ******* PRIVATE USER CONTROLLERS **** */
  /* E // GET INFOS **************************** */

  getInfos(req, res, next) {
    return res
      .status(200)
      .send({ success: true, message: "Info utilisateur", data: req.user });
  },




  /* ************************************************************************** */
  /* ********* ******** PART III : PRIVATE ADMIN CONTROLLERS ******** ********* */
  /* ************************************************************************** */

  /* III // ******* PRIVATE ADMIN CONTROLLERS ** */
  /* A // EDIT USER BY ADMIN ANY VALUE ********* */

  editUserByAdminAnyValue(req, res, next) {
    let { targetUserId, keyOfPropertyToChange, newValue } = req.body;
    if (!targetUserId || !keyOfPropertyToChange || newValue === undefined ) {
      return res.status(400).send({
        success: false,
        message:
          "Les informations n??ccessaires ?? la bonne ex??cution de la requ??te n'ont pas ??t?? re??ues.",
        logOfInputValue: `Log it bb. ${targetUserId}, ${keyOfPropertyToChange} ${newValue}`,
      });
    }
    return UserModel.updateOne(
      { _id: targetUserId },
      {
        $set: {
          [keyOfPropertyToChange]: newValue,
        },
      }
    )
      .then(() => {
        res.status(200).send({
          success: true,
          message: `User successfully changed. User with _id : ${targetUserId}. ${keyOfPropertyToChange} is now ${newValue}`,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: false,
          message: `Did not go well. User ${keyOfPropertyToChange} status wasn't changed to ${newValue}. ${targetUserId} Err Log : ${err}`,
        });
      });
  },

  /* III // ******* PRIVATE ADMIN CONTROLLERS ** */
  /* B // GET USER LIST ************************ */

  getCompleteUserList(req, res, next) {
    return UserModel.find({}).then((response) => {
      res.send(response);
    });
  },

  /* III // ******* PRIVATE ADMIN CONTROLLERS ** */
  /* C // TEST PRIVATE CONTROLLER ************** */

  testPrivateController(req, res, next) {
    console.log(
      `Private Controller Here : Current users name is : ${req.user.firstName} ${req.user.lastName}`
    );
    return res.send({
      success: true,
      message: `Private controller HERE. Current user is ${req.user.firstName} ${req.user.lastName}.
        His/Her Admin Status is ${req.user.infos.isAdmin}`,
    });
  },
};

module.exports = UserController;

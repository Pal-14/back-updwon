const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");
const JWT_SECRET = process.env.JWT_SECRET;

function readToken(req) {
    let authorization = req.headers.authorization;
    if (!authorization) return null;
    let splitted = authorization.split(" ");
    let token = splitted[1];
    if (token) return token;
    else return null;
    }




const Auth = {

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


}

module.exports = Auth
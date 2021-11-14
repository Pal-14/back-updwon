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
      if (token === null)
        return res
          .status(401)
          .send({ succes: false, message: "Pas de connexion" });
      jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
        if (err)
          return res
            .status(400)
            .send({ succes: false, message: "Erreur sur le Token" });
        let _id = decodedToken._id;
        UserModel.findOne({ _id: _id }).then((dbResponseWithUserDataInside) => {
          if (dbResponseWithUserDataInside === null)
            return res
              .status(404)
              .send({ succes: false, message: "Pas d'utilisateur associé" });
          req.user = dbResponseWithUserDataInside;
          req._id = decodedToken._id;
          next();
        });
      });
    },

  isAdmin(req, res, next) {
    if (req.user.infos.isAdmin != true) 
      return res
        .status(403)
        .send({ succes: false, message: "Vous ne disposez pas de droits suffisants. N'est pas un admin", log:`${req.user.infos.isAdmin}`});
    next();
    
  },
}

module.exports = Auth

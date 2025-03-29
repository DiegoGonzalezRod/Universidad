const { matchedData } = require('express-validator');
const UserModel = require('../models/users');
const { encrypt,compare } = require('../utils/handlePassword');
const { tokenSign } = require('../utils/handleJWT');
const { handleHttpError } = require('../utils/handleError');





const createItem = async (req, res) => {
    try{
        req = matchedData(req);
        const password = await encrypt(req.password);
        const body = {...req, password};
        const dataUser = await UserModel.create(body);
        dataUser.set('password', undefined, {strict: false});

        const data = {
            user: dataUser,
            token: await tokenSign(dataUser)
        }
        res.send(data)
    }catch(err){
        console.log(err)
        handleHttpError(res, "ERROR_REGISTER_USER")
    }
}

const userLogin = async (req, res) =>{
    try{
        req = matchedData(req);
        const dataUser = await UserModel.findOne({ email: req.email });
        if(!dataUser){
            handleHttpError(res, "USER_NOT_FOUND")
        }

        const hashpassword = dataUser.password;
        const check = await compare(req.password, hashpassword);

        if(!check){
            handleHttpError(res, "PASSWORD_NOT_MATCH")
        }

        //Para no mostrar la contraseña en la respuesta

        dataUser.set('password', undefined, {strict: false});
        const data = {
            token: await tokenSign(dataUser),
            user: dataUser
        }
        res.send(data)
    }catch(err){
        console.log(err)
        handleHttpError(res, "ERROR_LOGIN_USER")

    }

}
const validateEmailCode = async (req, res) => {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Token inválido o expirado" });
    }
  
    try {
      const { code } = req.body;
      const user = req.user;
  
      // 🔍 Aquí vemos quién está autenticado
      console.log("🧑 Usuario autenticado desde token:", user.email);
      console.log("🆔 ID del token:", user._id);
      console.log("🔐 Código guardado en DB:", user.code);
      console.log("📝 Código recibido:", code);
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      if (user.code.toString() !== code.toString()) {
        return res.status(400).json({ message: "Código inválido" });
      }
  
      user.estado = true;
      await user.save();
  
      return res.status(200).json({ message: "Email verificado correctamente" });
    } catch (error) {
      console.log("❌ Error en validación:", error);
      return res.status(500).json({ message: "Error interno" });
    }
  };
  


module.exports = {createItem, userLogin, validateEmailCode}

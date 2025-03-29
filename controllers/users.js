const { matchedData } = require('express-validator');
const UserModel = require('../models/users');
const { encrypt,compare } = require('../utils/handlePassword');
const { tokenSign } = require('../utils/handleJWT');
const { handleHttpError } = require('../utils/handleError');
const User = require('../models/users');






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

/**
 * Encargado de hacer login del usuario
 * @param {*} req 
 * @param {*} res 
 */
const userLogin = async (req, res) => {
    try {
      req = matchedData(req);
      const user = await UserModel.findOne({ email: req.email }).select("password name role email status");
  
      if (!user) {
        handleHttpError(res, "USER_NOT_EXISTS", 404);
        return;
      }
  
      if (user.status !== 'validated') {
        return res.status(401).json({ error: 'Email no verificado' });
      }
  
      const check = await compare(req.password, user.password);
  
      if (!check) {
        handleHttpError(res, "INVALID_PASSWORD", 401);
        return;
      }
  
      user.set('password', undefined, { strict: false });
  
      const data = {
        token: await tokenSign(user),
        user
      };
  
      res.send(data);
  
    } catch (err) {
      console.log(err);
      handleHttpError(res, "ERROR_LOGIN_USER");
    }
  };
  


const validateEmailCode = async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }

  try {
    const { code } = req.body;

    const user = await User.findById(req.user._id);


    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (user.code.toString() !== code.toString()) {
      return res.status(400).json({ message: "Código inválido" });
    }

    user.status = 'validated';
    await user.save();

    

    return res.status(200).json({ message: "Email verificado correctamente" });
  } catch (error) {
    console.log(" Error en validación:", error);
    return res.status(500).json({ message: "Error interno" });
  }
};

const updateUserPersonalData = async (req, res) => {
  try{
    const{name, apellidos,nif} = req.body;

    if(!name || !apellidos || !nif) {
      return res.status(400).json({ message: "Faltan Campos Obligatorios" });
    }

     // Aquí podrías validar el formato del NIF si querés
     req.user.name = name;
     req.user.apellidos = apellidos;
     req.user.nif = nif;
 
     await req.user.save();
 
     res.status(200).json({ message: "Datos personales actualizados" });
   } catch (err) {
     console.error(" Error en onboarding personal:", err);
     res.status(500).json({ message: "Error interno" });
   }
 };

 const updateUserCompanyData = async (req, res) => {
  try {
    const { companyName, cif, address, phone, isFreelance } = req.body;

    // 🔍 Ver exactamente qué llega
    console.log("⚠️ BODY recibido:", req.body);
    console.log("companyName:", companyName);
    console.log("cif:", cif);
    console.log("address:", address);
    console.log("phone:", phone);

    if (!companyName || !cif || !address || !phone) {
      console.log("❌ Faltan Campos Obligatorios");
      return res.status(400).json({ message: "Faltan Campos Obligatorios" });
    }

    req.user.company = isFreelance ? {
      companyName: req.user.name + " " + (req.user.apellidos || ""),
      cif: req.user.nif,
      address,
      phone,
      isFreelance: true
    } : {
      companyName,
      cif,
      address,
      phone,
      isFreelance: false
    };

    await req.user.save();

    res.status(200).json({ message: "Datos de empresa actualizados" });
  } catch (err) {
    console.error("❌ Error en onboarding empresa:", err);
    res.status(500).json({ message: "Error interno" });
  }
};



module.exports = {createItem, userLogin, validateEmailCode,updateUserPersonalData,updateUserCompanyData}

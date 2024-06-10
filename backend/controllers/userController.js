const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const { hash, compareHashed, sendEmail } = require("../helpers/auth");

const updateAddresses = async (req, res) => {
  try {
    const userId = req.params.id;
    const {
      name,
      surname,
      address1,
      address2,
      country,
      province,
      locality,
      postalCode,
    } = req.body;

    const user = await User.findById(userId);

    if (user) {
      if (
        !name &&
        !surname &&
        !address1 &&
        !country &&
        !province &&
        !locality &&
        !postalCode
      ) {
        return res.json({ error: "No puedes dejar espacios en blanco" });
      }

      if (!name) {
        return res.json({ error: "El nombre es requerido" });
      }

      if (!surname) {
        return res.json({ error: "El apellido es requerido" });
      }

      if (!address1) {
        return res.json({ error: "La dirección 1 es requerido" });
      }

      if (!country) {
        return res.json({ error: "La ciudad es requerida" });
      }

      if (!province) {
        return res.json({ error: "La provincia es requerida" });
      }

      if (!locality) {
        return res.json({ error: "La localidad es requerida" });
      }

      if (!postalCode) {
        return res.json({ error: "El código postal es requerido" });
      }

      user.shippingAddress = {
        name: name,
        surname: surname,
        address1: address1,
        address2: address2,
        country: country,
        province: province,
        locality: locality,
        postalCode: postalCode,
      };

      await user.save();
      res.status(200).json({ message: "Detalles de envio actualizados" });
    } else {
      res.status(200).json({ error: "" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

const getShippingAddress = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId);

    if (user) {
      return res.json(user.shippingAddress);
    } else {
      return res.json({ error: "No se ha encontrado el usuario" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error del servidor" });
  }
};

const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el usuario:", error);
    res.status(500).json({ error: "Error del servidor" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    if (users) {
      return res.json(users);
    }
  } catch (error) {
    console.error("Error al recoger usuarios: ", error);
  }
};

const changeUserAvatar = async (req, res) => {
  try {
    const userId = req.params.id;
    const avatar = req.body.avatar;
    const user = await User.findById(userId);

    if (user) {
      user.avatar = avatar;
      await user.save();
      res.status(200).json({ message: "Avatar actualizado" });
    } else {
      return res.json({ error: "Error al cambiar el avatar" });
    }
  } catch (error) {
    console.error("Error en changeAvatar: ", error);
  }
};

const changeUsername = async (req, res) => {
  try {
    const userId = req.params.id;
    const username = req.body.username;
    const user = await User.findById(userId);

    if (!username) {
      return res.json({ error: "Introduzca un nuevo nombre de usuario" });
    }

    if (user) {
      user.username = username;
      await user.save();
      res.status(200).json({ message: "Nombre de usuario actualizado" });
    } else {
      return res.json({ error: "Error al cambiar el nombre de usuario" });
    }
  } catch (error) {
    console.error("Error en changeUsername: ", error);
  }
};

const changePassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { actualPassword, newPassword, repeatNewPassword } = req.body;
    const user = await User.findById(userId);

    if (!actualPassword || !newPassword || !repeatNewPassword) {
      return res.json({
        error: "Debes rellenar todos los campos de contraseña",
      });
    }
    if (!actualPassword) {
      return res.json({
        error: "Debes escribir tu contraseña actual",
      });
    }
    if (!newPassword || newPassword.length < 6) {
      return res.json({
        error:
          "Debes escribir una contraseña nueva y debe tener al menos 6 caracteres",
      });
    }
    if (!repeatNewPassword) {
      return res.json({
        error: "Debes repetir la contraseña nueva",
      });
    }
    if (newPassword != repeatNewPassword) {
      return res.json({ error: "Las contraseñas no coinciden" });
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
      return res.json({
        error:
          "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
      });
    }

    if (user) {
      const matchPassword = await compareHashed(actualPassword, user.password);
      if (matchPassword) {
        const hashedPassword = await hash(newPassword);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Contraseña actualizada" });
      } else {
        return res.json({ error: "La contraseña actual es erronea" });
      }
    } else {
      return res.json({ error: "Error al cambiar la contraseña" });
    }
  } catch (error) {
    console.error("Error en changePassword: ", error);
  }
};

const deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    await Order.findOneAndDelete({ user: user });
    await Cart.findOneAndDelete({ userId: userId });
    await User.findByIdAndDelete(userId);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error eliminando usuario: ", error);
  }
};

const contactEmail = async (req, res) => {
  try {
    const { email, name, msg } = req.body;

    if (!email && !name && !msg) {
      return res.json({ error: "No puedes dejar espacios en blanco" });
    }
    if (!email) {
      return res.json({ error: "El correo es requerido" });
    }
    if (!name) {
      return res.json({ error: "El nombre es requerido" });
    }
    if (!msg) {
      return res.json({ error: "El mensaje es requerido" });
    }

    sendEmail(
      process.env.USER,
      name + " tiene una propuesta!",
      msg,
      `<h1>${name}</h1>
      <span>Correo: ${email}</span>
      <hr>
      <span>Mensaje: ${msg}</span>`
    );
    return res.json({ message: "¡Correo enviado!" });
  } catch (error) {
    res.json({ error: "Error al enviar el correo" });
    console.error("Error contactEmail back: ", error);
  }
};

module.exports = {
  updateAddresses,
  getShippingAddress,
  getUser,
  getAllUsers,
  changeUserAvatar,
  changeUsername,
  changePassword,
  deleteUser,
  contactEmail,
};

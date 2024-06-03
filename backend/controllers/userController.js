const User = require("../models/userModel");

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
      res.status(200).json({ message: "" });
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
    const userId = req.params.userid;
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

module.exports = { updateAddresses, getShippingAddress, getUser };

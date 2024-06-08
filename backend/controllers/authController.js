const User = require("../models/userModel");
const {
  hash,
  compareHashed,
  sendEmail,
} = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const EmailToken = require("../models/emailToken");
const path = require("path");

const registerUser = async (req, res) => {
  try {
    const { email, username, password, repeatPassword } = req.body;

    if (!username && !password && !email && !repeatPassword) {
      return res.json({
        error: "No puedes dejar espacios en blanco",
      });
    } else {
      if (!username) {
        return res.json({
          error: "El nombre de usuario es requerido",
        });
      }
      if (!email) {
        return res.json({
          error: "El correo es requerido",
        });
      }
      if (!password || password.length < 6) {
        return res.json({
          error:
            "La contraseña es requerida y debe tener al menos 6 caracteres",
        });
      }
      if (password != repeatPassword) {
        return res.json({
          error: "Las contraseñas no coinciden",
        });
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(password)) {
        return res.json({
          error:
            "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
        });
      }

      const exist = await User.findOne({ email });
      if (exist) {
        return res.json({
          error: "Este correo ya está en uso",
        });
      }

      const hashedPassword = await hash(password);
      let user = await User.create({
        email,
        username,
        password: hashedPassword,
      });

      const emailToken = await EmailToken.create({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      });
      const url = `${process.env.BASE_URL}/users/${user._id}/verify/${emailToken.token}`;
      await sendEmail(
        user.email,
        "¡Verifica tu cuenta de Laxart!",
        url,
        `<h1>Verifica tu cuenta</h1><p>Haz <a href='${url}'>clic aquí</a> para verificarte ahora.</p>`
      );

      return res.json({ message: "Se ha enviado un email de verifiación" });
    }
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return res.json({
        error: "No puedes dejar espacios en blanco",
      });
    }
    if (!email) {
      return res.json({
        error: "El correo es requerido",
      });
    }
    if (!password) {
      return res.json({
        error: "La contraseña es requerida",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "¡Lo siento, no encuentro una cuenta asociada a este correo!",
      });
    }

    const matchPassword = await compareHashed(password, user.password);
    if (matchPassword) {
      if (!user.verified && user.role != 1) {
        let emailToken = await EmailToken.findOne({ userId: user._id });
        if (!emailToken) {
          emailToken = await EmailToken.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          });
          const url = `${process.env.BASE_URL}/users/${user._id}/verify/${emailToken.token}`;
          await sendEmail(
            user.email,
            "¡Verifica tu cuenta de Laxart!",
            url,
            `<h1>Verifica tu cuenta</h1><p>Haz <a href='${url}'>clic aquí</a> para verificarte ahora.</p>`
          );
        }
        return res.status(200).json({
          message:
            "Se ha enviado un correo de verificación, por favor, verifica el correo.",
        });
      }
      jwt.sign(
        {
          email: user.email,
          id: user._id,
          username: user.username,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res
            .cookie("token", token, {
              httpOnly: true,
              path: "/",
              maxAge: 30 * 24 * 60 * 60 * 1000,
              sameSite: "none",
              secure: true,
            })
            .json(user); // Quitar en prod?
        }
      );
    }

    if (!matchPassword) {
      return res.json({
        error: "El correo o la contraseña no coinciden",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getProfile = async (req, res) => {
  const { token } = req.cookies;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;

      const user = await User.findOne({ _id: userId });

      if (user) {
        res.json(user);
      } else {
        res.clearCookie("token", {
          httpOnly: true,
          path: "/",
          maxAge: 30 * 24 * 60 * 60 * 1000,
          sameSite: "none",
          secure: true,
        });
        res.json(null);
      }
    } catch (error) {
      res.clearCookie("token", {
        httpOnly: true,
        path: "/",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        secure: true,
      });
      res.json(null);
    }
  } else {
    res.json(null);
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    secure: true,
  });
  res.status(200).json({ status: "success!" });
};

const verifyEmailToken = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send({ message: "Link no válido" });

    const emailToken = await EmailToken.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!emailToken) return res.status(400).send({ message: "Link no válido" });

    await user.updateOne({ _id: user._id, verified: true });
    await emailToken.remove();

    res.status(200).json({ message: "¡Email verificado correctamente!" });
  } catch (error) {
    res.json(error);
  }
};

const recoverPassword = async (req, res) => {
  try {
    const email = req.params.email;
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = await hash(token);

    if (!email) {
      return res.json({
        error: "Debes escribir un email para recuperar la contraseña",
      });
    }

    const user = await User.findOne({ email: email });

    if (user) {
      user.recoveryToken = hashedToken;
      const savedUser = await user.save();
      if (savedUser) {
        const url = `${process.env.BASE_URL}/users/recover-password/${user._id}/${token}`;
        await sendEmail(
          user.email,
          "¡Recupera tu contraseña!",
          url,
          `<h1>Recupera tu contraseña</h1><p>Haz <a href='${url}'>clic aquí</a> para recuperarla ahora.</p>`
        );
        res.status(200).json({
          message: "Se ha enviado un email para recuperar tu contraseña",
        });
      } else {
        console.error("Error guardando al usuario token: ", user);
      }
    } else {
      return res.json({
        error: "No hay ningún usuario registrado con este email",
      });
    }
  } catch (error) {
    console.error("Error en recoverPassword: ", error);
  }
};

const verifyRecoveringPage = async (req, res) => {
  try {
    const userId = req.params.id;
    const token = req.params.token;

    const user = await User.findById(userId);
    const matchTokens = await compareHashed(token, user.recoveryToken);
    if (matchTokens) {
      return res.status(200).json({ message: "Link válido" });
    } else {
      return res.json({ error: "Link no válido" });
    }
  } catch (error) {
    console.error("Error changeRecover: ", error);
  }
};

const recoverVerifiedPassword = async (req, res) => {
  try {
    const userId = req.params.id;
    const { newPassword, repeatNewPassword } = req.body;

    const user = await User.findById(userId);

    if (!newPassword || !repeatNewPassword) {
      return res.json({ error: "Debes ingresar las contraseñas" });
    }
    if (!newPassword) {
      return res.json({ error: "Debes ingresar una contraseña nueva" });
    }
    if (!repeatNewPassword) {
      return res.json({ error: "Debes repetir la contraseña" });
    }
    if (newPassword !== repeatNewPassword) {
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
      const hashedPassword = await hash(newPassword);
      user.password = hashedPassword;
      user.recoveryToken = "";
      await user.save();
      res.status(200).json({ message: "Contraseña actualizada" });
    } else {
      return res.json({ error: "Error al cambiar la contraseña" });
    }
  } catch (error) {
    console.error("Recover back pass: ", error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  verifyEmailToken,
  recoverPassword,
  verifyRecoveringPage,
  recoverVerifiedPassword,
};

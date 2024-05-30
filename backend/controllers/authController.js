const User = require("../models/userModel");
const {
  hashPassword,
  comparePasswords,
  sendEmail,
} = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const EmailToken = require("../models/emailToken");

// Register end-point
const registerUser = async (req, res) => {
  try {
    const { email, username, password, repeatPassword } = req.body;
    /*
     * Probar Zod https://www.youtube.com/watch?v=-9d3KhCqOtU&list=PLUofhDIg_38qm2oPOV-IRTTEKyrVBBaU7&index=4 min 39
     */
    // Checks if name was entered
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
      // Check if password is entered and has at least 6 characters
      if (!password || password.length < 6) {
        return res.json({
          error:
            "La contraseña es requerida y debe tener al menos 6 caracteres",
        });
      }
      // Checks if repeatPassword and password are the same
      if (password != repeatPassword) {
        return res.json({
          error: "Las contraseñas no coinciden",
        });
      }

      // Password regex for better security
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
      if (!passwordRegex.test(password)) {
        return res.json({
          error:
            "La contraseña debe contener al menos una mayúscula, una minúscula y un número",
        });
      }

      // Checks if email exists in the database
      const exist = await User.findOne({ email });
      if (exist) {
        return res.json({
          error: "Este correo ya está en uso",
        });
      }

      const hashedPassword = await hashPassword(password);
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
      await sendEmail(user.email, "¡Verifica tu cuenta de Laxart!", url);

      return res.json({ message: "Se ha enviado un email de verifiación" });
    }
  } catch (error) {
    console.log(error);
  }
};

//Login end-point
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Ckeck if email and password are entered
    if (!email || !password) {
      return res.json({
        error: "No puedes dejar espacios en blanco",
      });
    }

    // Ckeck if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({
        error: "¡Lo siento, no encuentro una cuenta asociada a este correo!",
      });
    }

    // Check if passwords match
    const matchPassword = await comparePasswords(password, user.password);
    if (matchPassword) {
      if (!user.verified && user.role != 1) {
        let emailToken = await EmailToken.findOne({ userId: user._id });
        if (!emailToken) {
          emailToken = await EmailToken.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
          });
          const url = `${process.env.BASE_URL}/users/${user._id}/verify/${emailToken.token}`;
          await sendEmail(user.email, "¡Verifica tu cuenta de Laxart!", url);
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
          res.cookie("token", token, { httpOnly: true }).json(user); // Quitar en prod?
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
        res.clearCookie("token");
        res.json(null);
      }
    } catch (error) {
      res.clearCookie("token");
      res.json(null);
    }
  } else {
    res.json(null);
  }
};

const logoutUser = async (req, res) => {
  res.clearCookie("token");
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

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
  verifyEmailToken,
};

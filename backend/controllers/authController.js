const User = require("../models/userModel");
const { hashPassword, comparePasswords } = require("../helpers/auth");
const jwt = require("jsonwebtoken");

const test = (req, res) => {
  res.json("test is working");
};

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
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
      })
        .then((user) => {
          console.log("Usuario creado y guardado:", user);
        })
        .catch((error) => {
          console.error("Error al crear y guardar el usuario:", error);
        });

      return res.json(user);
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
      jwt.sign(
        { email: user.email, id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(user);
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

const getProfile = (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) => {
      if (err) throw err;
      res.json(user);
    });
  } else {
    res.json(null);
  }
};

module.exports = {
  test,
  registerUser,
  loginUser,
  getProfile,
};

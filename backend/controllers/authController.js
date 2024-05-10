const User = require('../models/userModel')
const { hashPassword, comparePassword } = require('../helpers/auth');

const test = (req, res) => {
    res.json('test is working')
}

const registerUser = async (req, res) => {
    try {
        const { email, username, password, repeatPassword } = req.body;
        // Checks if name was entered
        if (!username && !password && !email && !repeatPassword) {
            return res.json({
                error: 'No puedes dejar espacios en blanco'
            })
        } else {
            if (!username) {
                return res.json({
                    error: 'El nombre de usuario es requerido'
                })
            }
            if (!email) {
                return res.json({
                    error: 'El correo es requerido'
                })
            }
            // Check if password is entered and has at least 6 characters
            if (!password || password.length < 6) {
                return res.json({
                    error: 'La contraseña es requerida y debe tener al menos 6 caracteres'
                })
            }
            // Checks if repeatPassword and password are the same
            if (password != repeatPassword) {
                return res.json({
                    error: 'Las contraseñas no coinciden'
                })
            }
    
            // Password regex for better security
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
            if (!passwordRegex.test(password)) {
                return res.json({
                    error: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
                });
            }
        
            // Checks if email exists in the database
            const exist = await User.findOne({email});
            if (exist) {
                return res.json({
                    error: 'Este correo ya está en uso'
                })
            }

            const hashedPassword = await hashPassword(password)
            const user = await User.create({
                email,
                username, 
                password: hashedPassword,
            })
            .then((user) => {
                console.log('Usuario creado y guardado:', user)
            })
            .catch((error) => {
                console.error('Error al crear y guardar el usuario:', error);
              });
    
            return res.json(user)    
        }
        
    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    test,
    registerUser
}
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(12, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};

const comparePasswords = (password, hashed) => {
  return bcrypt.compare(password, hashed);
};

const sendEmail = async (email, subject, text, html) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      post: Number(process.env.EMAIL_PORT),
      secure: true, // Cambiar a true en prod
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });

    await new Promise((resolve, reject) => {
      transporter.verify(function (error, success) {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          console.log("Servidor listo para recibir el mensaje");
        }
      });
    });

    const mailData = {
      from: process.env.USER,
      to: email,
      subject: subject,
      text: text,
      html: html,
    };

    await new Promise((resolve, reject) => {
      transporter.sendMail(mailData, (err, info) => {
        if (err) {
          console.error(err);
          reject(err);
        } else {
          console.log(info);
          resolve(info);
        }
      });
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.log("Email not sent");
    console.log(error);
  }
};

module.exports = {
  hashPassword,
  comparePasswords,
  sendEmail,
};

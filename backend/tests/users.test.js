const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const { app } = require("../index");
const User = require("../models/userModel");

let mongoServer;

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterEach(async () => {
  await mongoose.connection.close();
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe("User Controller", () => {
  describe("registerUser", () => {
    it("should register a new user", async () => {
      const response = await request(app).post("/register").send({
        email: "test@example.com",
        username: "testuser",
        password: "Password123",
        repeatPassword: "Password123",
      });
      expect(response.status).toBe(200);
      expect(response.body.message).toBe(
        "Se ha enviado un email de verifiación"
      );
    });
  });

  describe("loginUser", () => {
    it("should return an error if email and password are not provided", async () => {
      const response = await request(app).post("/login").send({});
      expect(response.status).toBe(200);
      expect(response.body.error).toBe("No puedes dejar espacios en blanco");
    });

    it("should return an error if email is not provided", async () => {
      const response = await request(app)
        .post("/login")
        .send({ password: "testPassword" });
      expect(response.status).toBe(200);
      expect(response.body.error).toBe("El correo es requerido");
    });

    it("should return an error if password is not provided", async () => {
      const response = await request(app)
        .post("/login")
        .send({ email: "test@example.com" });
      expect(response.status).toBe(200);
      expect(response.body.error).toBe("La contraseña es requerida");
    });

    it("should return an error if email or password is incorrect", async () => {
      const user = {
        email: "test@example.com",
        username: "testuser",
        password: "testPassword",
        verified: true,
        role: 0,
      };
      await User.create(user);

      const response = await request(app)
        .post("/login")
        .send({ email: user.email, password: "wrongPassword" });

      expect(response.status).toBe(200);
      expect(response.body.error).toBe(
        "El correo o la contraseña no coinciden"
      );
    });

    it("should login or send an email if everything goes right", async () => {
      const user = {
        email: "test@example.com",
        username: "testuser",
        password: "testPassword",
        verified: false,
        role: 0,
      };
      await User.create(user);

      const response = await request(app)
        .post("/login")
        .send({ email: user.email, password: user.password });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe();
    });
  });

  describe("updateAddress", () => {
    it("should update user addresses", async () => {
      const user = {
        id: "user_id",
        email: "test@example.com",
        username: "testuser",
        password: "testPassword",
        verified: false,
        role: 0,
      };
      await User.create(user);
      const userId = "user_id";
      const updateData = {
        name: "John",
        surname: "Doe",
        address1: "123 Main St",
        country: "USA",
        province: "California",
        locality: "Los Angeles",
        postalCode: "90001",
      };

      const response = await request(app)
        .put(`/users/${userId}/update-addresses`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Detalles de envio actualizados");
    });
  });
});

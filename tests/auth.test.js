const { expect } = require("chai");
const bcrypt = require("bcrypt");
const sinon = require("sinon");

const sequelize = require("../config/database");
const UserAuthentication = require("../models/userAuth.model");

describe("My first test", () => {
  it("should pass", () => {
    const result = true;
    expect(result).to.be.true;
  });
});

describe("Authentication", () => {
  let sandbox;

  before(() => {
    sandbox = sinon.createSandbox();
  });

  after(() => {
    sandbox.restore();
  });

  describe("User registration", () => {
    let hashStub;

    before(() => {
      hashStub = sinon.stub(bcrypt, "hash").resolves("hashedPassword");
    });

    after(() => {
      hashStub.restore();
    });

    beforeEach(async () => {
      await sequelize.sync({ force: true });
    });

    it("should successfully register a user", async () => {
      const email = "testuser@example.com";
      const password = "password123";
      const role = "customer";

      const user = await UserAuthentication.create({
        email: email,
        password: password,
        role: role,
      });

      expect(user.email).to.equal(email);
      expect(user.password).to.equal("hashedPassword");
    });

    it("should throw an error if email is not provided", async () => {
      const password = "password123";
      const role = "customer";

      await expect(
        UserAuthentication.create({
          password: password,
          role: role,
        })
      ).to.be.rejectedWith("Email is required");
    });

    it("should throw an error if password is not provided", async () => {
      const email = "testuser@example.com";
      const role = "customer";

      await expect(
        UserAuthentication.create({
          email: email,
          role: role,
        })
      ).to.be.rejectedWith("Password is required");
    });

    it("should throw an error if email is not a valid email address", async () => {
      const email = "notanemailaddress";
      const password = "password123";

      await expect(
        UserAuthentication.create({
          email: email,
          password: password,
        })
      ).to.be.rejectedWith(
        "Validation error: Validation isEmail on email failed"
      );
    });

    it("should throw an error if email is already in use", async () => {
      const email = "testuser@example.com";
      const password = "password123";

      await UserAuthentication.create({
        email: email,
        password: password,
      });

      await expect(
        UserAuthentication.create({
          email: email,
          password: password,
        })
      ).to.be.rejectedWith("Validation error: Email already exists");
    });
  });

  describe("login", () => {
    beforeEach(async () => {
      await UserAuthentication.sync({ force: true });

      const hashedPassword = await bcrypt.hash("mypassword", 10);
      await UserAuthentication.create({
        email: "test@example.com",
        password: hashedPassword,
      });
    });

    it("should log in a user with correct credentials", async () => {
      const user = await UserAuthentication.login({
        email: "test@example.com",
        password: "mypassword",
      });

      expect(user.email).to.equal("test@example.com");
    });

    it("should throw an error if email is missing", async () => {
      try {
        await UserAuthentication.login({
          password: "mypassword",
        });
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).to.equal("Email is required");
      }
    });

    it("should throw an error if password is missing", async () => {
      try {
        await UserAuthentication.login({
          email: "test@example.com",
        });
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).to.equal("Password is required");
      }
    });

    it("should throw an error if user does not exist", async () => {
      try {
        await UserAuthentication.login({
          email: "wrongemail@example.com",
          password: "mypassword",
        });
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message.to.equal("User not found"));
      }
    });

    it("should throw an error if password is incorrect", async () => {
      try {
        await UserAuthentication.login({
          email: "test@example.com",
          password: "wrongpassword",
        });
        expect.fail("Expected an error to be thrown");
      } catch (error) {
        expect(error.message).to.equal("Incorrect password");
      }
    });
  });
});

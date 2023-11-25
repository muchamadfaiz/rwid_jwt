const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthController } = require("./controllers/AuthController");
const { AuthValidator } = require("./validators/AuthValidator");
const app = express();
const { errorHandler, notFoundErrorHandler } = require("./errors");

require("dotenv").config();
const users = [];

app.use(express.json());

app.post("/login", AuthValidator.login(), AuthController.login);

app.post("/register", async (req, res, next) => {
    try {
        let { username, password } = req.body;
        password = await bcrypt.hash(password, "abc");

        users.push({ username, password });

        res.json({ message: "success", username });
    } catch (error) {
        next(error);
    }
});

app.get(
    "/users",
    (req, res, next) => {
        const authHeader = req.headers.authorization;
        const accessToken = authHeader.split(" ")[1];

        try {
            const payload = jwt.verify(accessToken, process.env.JWT_SECRET, {
                complete: true,
            });
            console.log(payload);
        } catch (error) {
            res.status(401).json({ message: "jwt invalid" });
            console.error(error);
        }

        next();
    },
    (req, res, next) => {
        res.json({ message: "success", users });
    }
);
app.use(notFoundErrorHandler);
app.use(errorHandler);
app.listen(3000);

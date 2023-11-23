const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { AuthRepository } = require("./repositories/AuthRepository");
const { AuthService } = require("./services/AuthService");
const app = express();

require("dotenv").config();

const users = [];

app.use(express.json());

app.post("/login", async (req, res, next) => {
    try {
        const credential = {
            name: req.body.name,
            password: req.body.password,
            provider: req.body.provider,
        };
        const user = await AuthRepository.login(credential);

        const isMatched = await AuthService.validateCredential(
            credential,
            user
        );

        if (!isMatched) {
            return res.status(401).json({ message: "password not match" });
        }

        const accessToken = AuthService.createToken(user);

        return res.json({ message: "success", accessToken });
    } catch (error) {
        return next(error);
    }
});

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

app.listen(3000);

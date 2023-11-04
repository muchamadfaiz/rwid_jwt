const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

require("dotenv").config();

const users = [];

app.use(express.json());

app.post("/login", async (req, res, next) => {
    console.log(users);
    const user = users.find((user) => {
        return user.username === req.body.username;
    });

    if (!user) {
        return res.status(404).json({ message: "user not found" });
    }

    const isMatched = await bcrypt.compare(req.body.password, user.password);

    if (!isMatched) {
        return res.status(401).json({ message: "password not match" });
    }

    const accessToken = jwt.sign(
        { sub: user.username },
        process.env.JWT_SECRET
    );

    return res.json({ message: "success", accessToken });
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

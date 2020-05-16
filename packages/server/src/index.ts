import express from "express";
import morgan from "morgan";
import http from "http";
import got from "got";
import qs from "qs";

const app = express();

const PORT_HTTP = process.env.PORT_HTTP ?? 8080;

const clientId = process.env.GH_CLIENT_ID ?? "test";
const clientSecret = process.env.GH_CLIENT_SECRET ?? "test";

app.use(express.json());
app.use(morgan("common"));

app.get("/", (_req, res) => {
    res.sendStatus(418);
});

app.get("/client_id", (_req, res) => {
    res.send({ client_id: clientId });
});

app.post("/token", async (req, res) => {
    const { code } = req.body;

    if (!code) {
        console.warn("Request for /token with no code");
        return res.status(401).send({ error: "Missing code" });
    }

    const { body: tokenResponse } = await got.post(
        `https://github.com/login/oauth/access_token?${qs.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
        })}`,
        { method: "POST" },
    );

    if (!tokenResponse) {
        return console.error("No body in response from /access_token");
    }

    const { access_token } = qs.parse(tokenResponse);

    res.send({ access_token });
});

const httpServer = http.createServer(app);

httpServer.listen(PORT_HTTP, () => {
    console.log("serving over http at", PORT_HTTP);
});

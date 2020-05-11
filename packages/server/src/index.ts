import express from "express";
import morgan from "morgan";
import http from "http";
import https from "https";
import fs from "fs";
import got from "got";
import qs from "qs";

const app = express();

const keyFile = "key.pem";
const certFile = "cert.pem";

const PORT_HTTP = process.env.PORT_HTTP ?? 8080;
const PORT_HTTPS = process.env.PORT_HTTPS ?? 8443;

const clientId = process.env.GH_CLIENT_ID ?? "test";
const clientSecret = process.env.GH_CLIENT_SECRET ?? "test";

app.use(express.json());
app.use(morgan("common"));

app.get("/", (req, res) => {
    res.sendStatus(418);
});

app.get("/client_id", (req, res) => {
    res.send({ client_id: clientId });
});

app.post("/token", (req, res) => {
    console.log(req.body);

    const { code } = req.body;

    if (!code) {
        console.warn("Request for /token with no code");
        return res.status(401).send({ error: "Missing code" });
    }

    const query = qs.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
    });

    console.log("Code step", { code, query });

    return got
        .post(`https://github.com/login/oauth/access_token?${query}`, {
            method: "POST",
        })
        .then(({ body }) => {
            if (!body) {
                return console.error("No body in response");
            }

            const { access_token } = qs.parse(body);
            res.send({ access_token });
        })
        .catch((err) => {
            console.error(err);
            res.status(403).send("GitHub auth failed");
        });
});

const httpServer = http.createServer(app);

httpServer.listen(PORT_HTTP, () => {
    console.log("serving over http at", PORT_HTTP);
});

if (fs.existsSync(keyFile) && fs.existsSync(certFile)) {
    const ssl = {
        key: fs.readFileSync(keyFile),
        cert: fs.readFileSync(certFile),
    };

    const httpsServer = https.createServer(ssl, app);
    httpsServer.listen(PORT_HTTPS, () => {
        console.log("serving over https at", PORT_HTTPS);
    });
} else {
    console.warn("No SSL key or cert found");
}

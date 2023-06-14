const express = require("express");
const cors = require("cors");
const axios = require("axios");
const fileUpload = require("express-fileupload");
const bodyParser = require("body-parser");

const frontEnd = process.env.frontEndURL;
const allowedOrigins = [frontEnd];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

const app = express();

app.use(express.json());
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.put("/api/:database/:process", async (req, res) => {
  const baseUrl = "http://kafkabasex:8984/rest";
  const { database, process } = req.params;
  const { xmlData } = req.body;
  const url = `${baseUrl}/${database}/${process}`;

  const headers = {
    Authorization: "Basic YWRtaW46YWRtaW4=",
    "Content-Type": "application/xml",
  };

  try {
    const response = await axios.put(url, xmlData, { headers });
    res.status(200).json({ data: "File uploaded successfully!", error: null });
  } catch (error) {
    res.status(500).send(`Error uploading data to BPMN API: ${error}`);
    throw error;
  }
});

app.post("/api/upload", (req, res) => {
  if (!req.files) {
    return res.status(400).send("No files were uploaded.");
  }

  const file = req.files.file;
  const filePath = "/app/models/" + file.name;

  file.mv(filePath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }

    res.status(200).json({ data: "File uploaded successfully!", error: null });
  });
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:4000");
});

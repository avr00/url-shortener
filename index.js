const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
const helmet = require("helmet");
const yup = require("yup");
const path = require("path");
const { nanoid } = require("nanoid");
require("dotenv").config();

console.log("ASDSA", process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const urlSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    index: true,
  },
  url: String,
});

const Url = mongoose.model("Url", urlSchema);

const app = express();

app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

const schema = yup.object().shape({
  slug: yup
    .string()
    .trim()
    .matches(/[a-z0-00?-]/i),
  url: yup.string().trim().url().required(),
});

app.get("/:id", async (req, res) => {
  // TODO: redirect to url
  const { id: slug } = req.params;
  try {
    const url = await Url.findOne({ slug }).exec();
    if (url) {
      res.redirect(url.url);
    }
    res.redirect(`/?error=${slug}-slug-not-found`);
  } catch (error) {
    res.redirect(`/?error=${slug}-link-not-found`);
  }
});

app.post("/url", async (req, res, next) => {
  let { slug, url } = req.body;

  try {
    await schema.validate({ slug, url });
    if (!slug) {
      slug = nanoid(5);
    }

    slug = slug.toLowerCase();
    const newUrl = {
      url,
      slug,
    };

    const created = await Url.create(newUrl);
    res.json(created);
  } catch (error) {
    if (error.message.startsWith("E11000")) {
      error.message = `Slug in use. 🍔`;
    }
    next(`There was an error ${error}`);
  }
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === "production" ? "🍰" : error,
  });
});

const port = process.env.PORT || 1337;

app.use(express.static(path.join(__dirname, "client/build")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => {
  console.log(`Listening at http://localhost${port}`);
});

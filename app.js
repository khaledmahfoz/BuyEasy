const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const randomstring = require("randomstring");
const User = require("./models/users");
const authRouter = require("./routes/auth");
const adminRouter = require("./routes/admin");
const shopRouter = require("./routes/shop");
const errorRoute = require("./routes/error");
const multer = require("multer");
const helmet = require("helmet");
const compression = require("compression");

const db = process.env.MONGO_INFO;
const app = express();
app.set("view engine", "pug");

const store = new mongoDBStore({
	uri: db,
	collection: "sessions",
});
store.on("error", function (error) {
	console.log(error);
});
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "images")));
app.use(bodyParser.urlencoded({ extended: false }));

const fileStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "images");
	},
	filename: (req, file, cb) => {
		cb(
			null,
			`${randomstring.generate()}-${file.originalname.replace(/\s/g, "")}`
		);
	},
});

const fileFilter = (req, file, cb) => {
	if (
		file.mimetype === "image/png" ||
		file.mimetype === "image/jpg" ||
		file.mimetype === "image/jpeg"
	) {
		cb(null, true);
	} else {
		cb(null, false);
	}
};

app.use(
	multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);

app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { maxAge: 31556926000000 },
		store: store,
	})
);

app.use(csrf());

app.use((req, res, next) => {
	if (!req.session.user) {
		return next();
	}
	User.findById(req.session.user._id)
		.then((user) => {
			if (!user) {
				return next();
			}
			req.user = user;
			next();
		})
		.catch((err) => {
			next(err);
		});
});

app.use((req, res, next) => {
	res.locals.csrfToken = req.csrfToken();
	if (req.session.user) {
		res.locals.isLoggedIn = req.session.isLoggedIn;
		res.locals.isAdmin = req.session.user.isAdmin;
		res.locals.userName = req.session.user.username;
	}
	next();
});

app.use("/admin", adminRouter);
app.use(shopRouter);
app.use(authRouter);
app.use(errorRoute);

app.use(helmet());
app.use(compression());

app.use((err, req, res, next) => {
	res.status(500).render("500", { title: "500", path: "" });
});

mongoose
	.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(() => {
		app.listen(process.env.PORT || 8000);
	})
	.catch((err) => console.log(err));

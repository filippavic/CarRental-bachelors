const express = require("express");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/start_page", require("./routes/api/start_page"));
app.use("/api/user_page", require("./routes/api/user_page"));
app.use("/api/admin_page", require("./routes/api/admin_page"));
app.use("/api/users", require("./routes/api/users"));


// app.use(express.static(path.join(__dirname, "build")));
// app.get("*", (req, res) =>
// 	res.sendFile(path.resolve(__dirname, "build", "index.html"))
// );

const buildPath = path.join(__dirname, "build");
app.use(express.static(buildPath));
app.get("/", (req, res) => res.sendFile(path.join(buildPath, "index.html")));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}...`));

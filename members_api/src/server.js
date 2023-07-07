const express = require("express");
const chalk = require("chalk");
const connectMongo = require("./api/config/connect-mongo");
const errorHandler = require("./api/middleware/error-handler.middleware");
const dotenv = require("dotenv");
const cors = require("cors");

const auth_routes = require("./api/router/auth.routes");
const user_routes = require("./api/router/user.routes");
const post_routes = require("./api/router/post.routes");
const comment_routes = require("./api/router/comment.routes");
const album_routes = require("./api/router/album.routes");
const photo_routes = require("./api/router/photo.routes");
const menu_routes = require("./api/router/menu.routes");
const brand_routes = require("./api/router/brand.routes");
const product_routes = require("./api/router/product.routes");
const order_routes = require("./api/router/order.routes");

const app = express();

dotenv.config({
  path: `${__dirname}/api/config/environment/${process.env.NODE_ENV}.env`,
});

// ========== Incoming Request Body Parsers ========== //
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", auth_routes);
app.use("/api/users", user_routes);
app.use("/api/posts", post_routes);
app.use("/api/comments", comment_routes);
app.use("/api/albums", album_routes);
app.use("/api/photos", photo_routes);
app.use("/api/menu", menu_routes);
app.use("/api/brands", brand_routes);
app.use("/api/products", product_routes);
app.use("/api/orders", order_routes);

app.use(errorHandler);

app.listen(process.env.PORT, (request, response) => {
  console.info(
    chalk.bold.yellow(
      `Server running in ${process.env.NODE_ENV} mode on port: ${process.env.PORT}`
    )
  );

  connectMongo();
});

import express from "express";
import router from "./routes/index.js";
import { connectMongoDB } from "./config/mongoDb.config.js";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import initializePassport from "./config/passport.config.js";
import cookieParser from "cookie-parser";
import envs from "./config/env.config.js";
import swaggerUiExpress from "swagger-ui-express";
import { errorHandle } from "./errors/errorHandle.js";
import { logger } from "./utils/logger.js";
import { specs } from "./config/swagger.config.js";

connectMongoDB();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(envs.CODE_SECRET));
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: envs.MONGO_URL,
      ttl: 15,
    }),
    secret: envs.CODE_SECRET,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
initializePassport();

app.use("/api-docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

app.use("/api", router);

app.get("/operacionsencilla", (req, res) => {
  let sum = 0;
  for (let i = 0; i < 100000; i++) {
    sum += i;
  }

  res.send({ sum });
});

app.get("/operacioncompleja", (req, res) => {
  let sum = 0;
  for (let i = 0; i < 5e8; i++) {
    sum += i;
  }

  res.send({ sum });
});

//endpoint para probar los logs
app.get("/loggerTest", (req, res) => {

// niveles de logging
  logger.debug("debug");
  logger.http("http")
  logger.info("info");
  logger.warn("warn");
  logger.error("error");
  logger.fatal("fatal");  

  res.status(200).json({ status: "success", msg: "Logs generados. Revisa tus archivos de logs o la consola para ver los mensajes." });
});
app.use(errorHandle);

app.listen(envs.PORT, () => {
  logger.log("info", `Escuchando el servidor en el puerto ${envs.PORT}`);
});
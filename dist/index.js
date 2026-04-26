import express from "express";
import { calculateRouter } from "./routes/calculate.js";
const app = express();
const port = Number(process.env.PORT ?? 3000);
app.use(express.json());
app.get("/health", (_request, response) => {
    response.json({
        status: "ok",
        company: "CalcCo",
    });
});
app.use("/api", calculateRouter);
app.use((_request, response) => {
    response.status(404).json({ error: "Route not found." });
});
app.listen(port, () => {
    console.log(`CalcCo API listening on http://localhost:${port}`);
});

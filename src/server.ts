import app from "./app";
import { config } from "./config";


app.listen({port: config.port}, () => {
  console.log(`Server is running on http://localhost:${config.port}`);
});
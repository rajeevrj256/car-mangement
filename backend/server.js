import express from "express";
import connectDB from "./utils/db_connect.js";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { userAuthHandler } from "./models/user.js"; 
import { saveproduct, getProductsByGoogleId ,updateProduct,deleteProduct,getProductsById} from "./models/productCreate.js"; 
const app = express();

app.use(express.json());
app.use(cors());

connectDB();
const options = {
    definition: {
      openapi: "3.0.0", 
      info: {
        title: "Car Management API", 
        version: "1.0.0", 
        description: "API documentation for the car management system",
      },
      servers: [
        {
          url: "https://car-mangement.onrender.com", 
        },
      ],
    },
    apis: ["./server.js","./models/user.js","./models/productCreate.js"], 
  };

  const swaggerSpec = swaggerJsdoc(options);


app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/swagger.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec); // Send the Swagger specification as JSON
  });



//Routes
app.get("/", (req, res) => res.send("API is running..."));
app.post("/api/auth/google", userAuthHandler);
app.post("/api/user/product", saveproduct);
app.get('/api/user/product/:googleId', getProductsByGoogleId); 
app.get('/api/user/product/:googleId/:id', getProductsById);
app.put("/api/user/product/:googleId/:id", updateProduct);
app.delete("/api/user/product/:googleId/:id", deleteProduct); 






const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

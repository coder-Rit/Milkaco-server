const app = require('./app')
 

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log(`Shutting down the server due to Uncaught Exception`);
    process.exit(1);
  });

// Config
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({ path: "backend/config/config.env" });
}

 
  

// server code
app.listen(process.env.PORT,()=>{
    console.log(`server is runing at ${process.env.PORT}`);
})

 
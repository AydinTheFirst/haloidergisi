import mongoose from "mongoose";

// Connect to Mongoose
mongoose.set("strictQuery", true);

try {
  await mongoose.connect(process.env.mongodb as string);
  console.log("Mongoose connection is successfull!");
} catch (error: any) {
  throw new Error(error);
}

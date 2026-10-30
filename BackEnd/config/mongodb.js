import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log("DB Connected successfully!");
        });

        mongoose.connection.on('error', (err) => {
            console.log("Mongoose connection error:", err.message);
        });

        await mongoose.connect(process.env.MONGODB_URI, {
            family: 4,
            tls: true,
            tlsAllowInvalidCertificates: true,
            tlsAllowInvalidHostnames: true,
        });
    } catch (error) {
        console.error("DB Connection failed:", error.message);
    }
}

export default connectDB;
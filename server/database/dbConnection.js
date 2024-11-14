import mongoose from 'mongoose';

export default async function dbConnection() {
    console.log("print before strict query");
    mongoose.set('strictQuery', true);
    console.log("print after strict query");

    try {
        await mongoose.connect(process.env.DB_CONNECTION, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("DB connected successfully");
    } catch (error) {
        console.error("DB connection error:", error.message);
        process.exit(1); // Optional: Exit the process on DB connection failure
    }
}

// Global error handler for uncaught exceptions
process.on("uncaughtException", (error) => {
    console.error("Uncaught Exception:", error.message);
    process.exit(1); // Optional: Exit the process on an unhandled exception
});

// Global error handler for unhandled promise rejections
process.on("unhandledRejection", (reason) => {
    console.error("Unhandled Rejection:", reason);
    process.exit(1); // Optional: Exit the process on an unhandled rejection
});

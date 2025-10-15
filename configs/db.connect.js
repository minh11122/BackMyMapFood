const mongoose = require('mongoose');
const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_ALATAS_URL}`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

module.exports = connectDB;
// const mongoose = require('mongoose');

// const connectMongoDB = async () => {
//   const mongoURI = process.env.MONGODB_LOCAL_URL || "mongodb://127.0.0.1:27017/Data";

//   try {
//     await mongoose.connect(mongoURI); // chỉ dùng local
//     console.log('✅ MongoDB connected successfully (local)');
//   } catch (error) {
//     console.error('❌ MongoDB connection error:', error.message);
//     process.exit(1);
//   }

//   mongoose.connection.on('disconnected', () => {
//     console.warn('⚠️ MongoDB disconnected!');
//   });

//   mongoose.connection.on('error', (err) => {
//     console.error('⚠️ MongoDB error:', err);
//   });
// };

// module.exports = connectMongoDB;


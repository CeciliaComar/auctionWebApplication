import express from 'express';
import mongoose from 'mongoose';
import config from './config/environment.js';
import { setupMiddleware } from './initializers/setupMiddleware.js';
import routes from './routes/index.js';
import path from 'path';



class Application {
    constructor(config) {
        this.config = config;
        this.app = express();
    }

    async initialize() {
        // Set up middleware
        setupMiddleware(this.app);
        console.log('Mongo URI:', process.env.MONGO_URI);

        // Set up routes
        this.app.use(routes);

        // Convert the URL to a file path
        const __dirname = path.resolve();
        this.app.use(express.static(path.join(__dirname, 'public')));

        


        // Connect to MongoDB
        try {
            await mongoose.connect(this.config.mongoUri, { //We use the mongoUri property from the config object to get the MongoDB URI.
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            console.log('Successfully connected to MongoDB');
        } catch (err) {
            console.error('Error connecting to MongoDB:', err);
        }

        console.log('Application initialized');
    }

    start() {
        this.app.listen(this.config.port, () => {
            console.log(`Server running on port ${this.config.port}`);
        });
    }
}

export default Application;

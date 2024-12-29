import Application from './app.js';
import config from './config/environment.js';

const app = new Application(config);

// Initialize and start the application
app.initialize();
app.start();

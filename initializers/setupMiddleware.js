import bodyParser from 'body-parser';
import morgan from 'morgan';
import authRoutes from '../routes/auth.js'
import express from 'express';

export function setupMiddleware(app) {
    // Setup middleware
    app.use(express.json());  // Middleware to parse JSON
    app.use(bodyParser.json()); // Parse JSON request bodies
    app.use(morgan('dev'));     // Log HTTP requests
    app.use(express.static('public'));

    console.log('Middleware initialized');
}

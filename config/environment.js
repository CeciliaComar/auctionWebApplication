const config = {
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000,
    mongoUri: process.env.MONGO_URI || 'mongodb://comar_db:27017/app',
    //The mongoUri will point to the MongoDB service in your Docker setup (mongodb://db:27017/myapp), where db is the name of the MongoDB container defined in docker-compose.yml.
    jwtSecret: 'your-secret-key',
  };
  
  export default config;
  
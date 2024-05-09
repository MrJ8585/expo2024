const { Client } = require('pg');
require('dotenv').config();


// Crea una instancia de cliente con el connection string
const client = new Client({
    connectionString: process.env.DB_STRING,
});


// Función para conectar el cliente a la base de datos
async function connectDB() {
    try {
        await client.connect();
        console.log('Conexión exitosa a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
    }
}

// Exporta el cliente PostgreSQL y la función de conexión
module.exports = {
    client,
    connectDB,
};

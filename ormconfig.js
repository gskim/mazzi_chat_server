module.exports = {
    "logging": true,
    "type": "mysql",
	"host": process.env.DB_ENDPOINT,
    "port": 3306,
    "username": process.env.DB_USERNAME,
	"password": process.env.DB_PASSWORD,
	"database": process.env.DB_DATABASE,
    "entities": ["./dist/entities/*.js"],
    "migrations": ["./src/migrations/*.ts"],
    "dateStrings": ['DATE'],
    "cli": {
        "migrationsDir": "./src/migrations"
    }
}
import { Sequelize } from "sequelize";

export const database = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {require: true , rejectUnauthorized: false}
    }
})
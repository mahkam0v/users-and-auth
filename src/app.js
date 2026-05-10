import express from "express"
import dotenv from "dotenv"
import userRoutes from "./routes/user.routes.js"
import todoRoutes from "./routes/todo.routes.js"
import { AppDataSource } from "./config/data-source.js"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002

app.use(express.json())
app.use("/uploads", express.static("uploads"))
app.use("/api/users", userRoutes)
app.use("/api/todos", todoRoutes)

app.use((err, _req, res, _next) => {
	const statusCode = err.statusCode || 500
	res.status(statusCode).json({
		error: err.message || "Internal server error",
	})
})

const startServer = async () => {
	try {
		await AppDataSource.initialize()
		console.log("Postgres TypeORM orqali ulandi")

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`)
		})
	} catch (error) {
		console.error("Server ishga tushmadi:", error.message)
		process.exit(1)
	}
}

startServer()

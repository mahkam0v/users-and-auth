import * as userRepository from "../repositories/user.repository.js"
import jwt from "jsonwebtoken"

import bcrypt from 'bcrypt'

const sanitizeUser = (user) => {
	const userObject = user.toObject ? user.toObject() : user
	delete userObject.password

	return userObject
}

const parseUserId = (id) => {
	const parsedId = Number.parseInt(id, 10)

	if (Number.isNaN(parsedId) || parsedId <= 0) {
		const error = new Error("Invalid user ID format")
		error.statusCode = 400
		throw error
	}

	return parsedId
}

export const getAllUsers = async (query) => {
	const filters = {}

	if (query.age) {
		filters.age = query.age
	}

	if (query.name) {
		filters.name = query.name
	}

	const page = parseInt(query.page, 10) || 1
	const limit = parseInt(query.limit, 10) || 10

	const users = await userRepository.findAllUsers(filters, page, limit)

	return users.map((user) => sanitizeUser(user))
}

export const getUserById = async (id, currentUser) => {
	const userId = parseUserId(id)

	if (
		currentUser.role !== "admin" &&
		currentUser.id !== userId
	) {
		const error = new Error("Siz faqat o'zingizni ko'ra olasiz")
		error.statusCode = 403
		throw error
	}

	const user = await userRepository.findUserById(userId)

	if (!user) {
		const error = new Error("User not found")
		error.statusCode = 404
		throw error
	}

	return sanitizeUser(user)
}

export const createUser = async (data) => {
	const { name, email, age, userImage, password, role } = data

	const existingUser = await userRepository.findUserByEmail(email)

	if (existingUser) {
		const error = new Error("Email already exists")
		error.statusCode = 400
		throw error
	}

	const hashedPassword = await bcrypt.hash(password, 10)

	const user = await userRepository.createUser({
		name,
		email,
		age,
		userImage,
		password: hashedPassword,
		role,
	})

	return sanitizeUser(user)
}

export const deleteUser = async (id) => {
	const userId = parseUserId(id)

	const deletedUser = await userRepository.deleteUserById(userId)

	if (!deletedUser) {
		const error = new Error("User not found")
		error.statusCode = 404
		throw error
	}

	return sanitizeUser(deletedUser)
}


export const register = async (data) => {	
	const { name, email, password, age, role } = data

	const existingUser = await userRepository.findUserByEmail(email)
	if (existingUser) {
		const error = new Error("User already exists")
		error.statusCode = 400
		throw error
	}

	const hashedPassword = await bcrypt.hash(password, 10)

	const user = await userRepository.createUser({
		name,
		email,
		password: hashedPassword,
		age,
		role,
	})

	const token = jwt.sign(
		{ id: user.id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" },
	)

	return { user: sanitizeUser(user), token }
}

export const login = async ({ email, password }) => {
	const user = await userRepository.findUserByEmail(email)
	if (!user) {
		const error = new Error("Invalid credentials")
		error.statusCode = 401
		throw error
	}

	const isMatch = await bcrypt.compare(password, user.password)
	if (!isMatch) {
		const error = new Error("Invalid credentials")
		error.statusCode = 401
		throw error
	}

	const token = jwt.sign(
		{ id: user.id, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: "1d" },
	)

	return { user: sanitizeUser(user), token }
}

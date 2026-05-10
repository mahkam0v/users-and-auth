import { ILike } from "typeorm"
import { AppDataSource } from "../config/data-source.js"
import { UserEntity } from "../models/user.entity.js"

const getUserRepository = () => AppDataSource.getRepository(UserEntity)

export const findAllUsers = async (filters = {}, page = 1, limit = 10) => {
	const userRepository = getUserRepository()
	const where = {}

	if (filters.age !== undefined) {
		where.age = Number(filters.age)
	}

	if (filters.name) {
		where.name = ILike(`%${filters.name}%`)
	}

	return userRepository.find({
		where,
		order: { id: "DESC" },
		skip: (page - 1) * limit,
		take: limit,
	})
}

export const findUserById = async (id) => {
	const userRepository = getUserRepository()

	return userRepository.findOne({
		where: { id },
	})
}

export const findUserByEmail = async (email) => {
	const userRepository = getUserRepository()

	return userRepository.findOne({
		where: { email: email.toLowerCase() },
	})
}

export const createUser = async (userData) => {
	const userRepository = getUserRepository()
	const newUser = userRepository.create({
		...userData,
		email: userData.email.toLowerCase(),
	})

	return userRepository.save(newUser)
}

export const deleteUserById = async (id) => {
	const userRepository = getUserRepository()
	const userToDelete = await userRepository.findOneBy({ id })

	if (!userToDelete) {
		return null
	}

	return userRepository.remove(userToDelete)
}

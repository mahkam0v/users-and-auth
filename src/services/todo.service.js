import * as todoRepository from "../repositories/todo.repository.js"
import * as userRepository from "../repositories/user.repository.js"

const checkTodoId = (id) => {
	const parsedId = Number.parseInt(id, 10)

	if (Number.isNaN(parsedId) || parsedId <= 0) {
		const error = new Error("Invalid todo ID format")
		error.statusCode = 400
		throw error
	}

	return parsedId
}

const checkUserId = (id) => {
	const parsedId = Number.parseInt(id, 10)

	if (Number.isNaN(parsedId) || parsedId <= 0) {
		const error = new Error("Invalid user ID format")
		error.statusCode = 400
		throw error
	}

	return parsedId
}
export const getAllTodos = async (currentUser, query) => {
	const filters = {}

	if (currentUser.role === "admin") {
		if (query.assignedTo) {
			filters.assignedTo = checkUserId(query.assignedTo)
		}
	} else {
		filters.assignedTo = currentUser.id
	}

	return todoRepository.findAllTodos(filters)
}

export const getTodoById = async (id, currentUser) => {
	const todoId = checkTodoId(id)

	const todo = await todoRepository.findTodoById(todoId)

	if (!todo) {
		const error = new Error("Todo not found")
		error.statusCode = 404
		throw error
	}

	if (
		currentUser.role !== "admin" &&
		todo.assignedTo &&
		todo.assignedTo.id !== currentUser.id
	) {
		const error = new Error("Siz bu todo ni ko'ra olmaysiz")
		error.statusCode = 403
		throw error
	}

	return todo
}

export const createTodo = async (data, currentUser, adminUserId) => {
	const creatorId = checkUserId(adminUserId)

	if (currentUser.id !== creatorId) {
		const error = new Error("URL dagi user bilan token user mos emas")
		error.statusCode = 403
		throw error
	}

	if (currentUser.role !== "admin") {
		const error = new Error("Userlar todo yarata olmaydi!")
		error.statusCode = 403
		throw error
	}

	const assignedUserId = checkUserId(data.assignedTo)

	const assignedUser = await userRepository.findUserById(assignedUserId)

	if (!assignedUser) {
		const error = new Error("Biriktiriladigan user topilmadi")
		error.statusCode = 404
		throw error
	}

	if (assignedUser.role !== "user") {
		const error = new Error("Todo faqat oddiy user ga biriktiriladi")
		error.statusCode = 400
		throw error
	}

	return todoRepository.createTodo({
		title: data.title,
		description: data.description,
		isCompleted: data.isCompleted,
		assignedTo: assignedUser,
		createdBy: currentUser,
	})
}

export const updateTodo = async (id, data, currentUser) => {
	if (currentUser.role !== "admin") {
		const error = new Error("Faqat admin todo ni o'zgartira oladi")
		error.statusCode = 403
		throw error
	}

	const todoId = checkTodoId(id)

	if (data.assignedTo) {
		const assignedUserId = checkUserId(data.assignedTo)

		const assignedUser = await userRepository.findUserById(assignedUserId)

		if (!assignedUser) {
			const error = new Error("Biriktiriladigan user topilmadi")
			error.statusCode = 404
			throw error
		}

		if (assignedUser.role !== "user") {
			const error = new Error("Todo faqat oddiy user ga biriktiriladi")
			error.statusCode = 400
			throw error
		}

		data.assignedTo = assignedUser
	}

	const todo = await todoRepository.updateTodoById(todoId, data)

	if (!todo) {
		const error = new Error("Todo not found")
		error.statusCode = 404
		throw error
	}

	return todo
}

export const deleteTodo = async (id, currentUser) => {
	if (currentUser.role !== "admin") {
		const error = new Error("Faqat admin todo ni o'chira oladi")
		error.statusCode = 403
		throw error
	}

	const todoId = checkTodoId(id)

	const todo = await todoRepository.deleteTodoById(todoId)

	if (!todo) {
		const error = new Error("Todo not found")
		error.statusCode = 404
		throw error
	}

	return todo
}

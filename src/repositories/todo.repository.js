import { AppDataSource } from "../config/data-source.js"
import { TodoEntity } from "../models/todo.entity.js"

const getTodoRepository = () => AppDataSource.getRepository(TodoEntity)

const relations = {
	assignedTo: true,
	createdBy: true,
}

export const findAllTodos = async (filters = {}) => {
	const todoRepository = getTodoRepository()
	const where = {}

	if (filters.assignedTo) {
		where.assignedTo = { id: filters.assignedTo }
	}

	return todoRepository.find({
		where,
		relations,
		order: { id: "DESC" },
	})
}

export const findTodoById = async (id) => {
	const todoRepository = getTodoRepository()

	return todoRepository.findOne({
		where: { id },
		relations,
	})
}

export const createTodo = async (data) => {
	const todoRepository = getTodoRepository()
	const todo = todoRepository.create(data)
	const savedTodo = await todoRepository.save(todo)

	return findTodoById(savedTodo.id)
}

export const updateTodoById = async (id, data) => {
	const todoRepository = getTodoRepository()
	const existingTodo = await todoRepository.findOneBy({ id })

	if (!existingTodo) {
		return null
	}

	const mergedTodo = todoRepository.merge(existingTodo, data)
	await todoRepository.save(mergedTodo)

	return findTodoById(id)
}

export const deleteTodoById = async (id) => {
	const todo = await findTodoById(id)

	if (!todo) {
		return null
	}

	const todoRepository = getTodoRepository()
	await todoRepository.remove(todo)

	return todo
}

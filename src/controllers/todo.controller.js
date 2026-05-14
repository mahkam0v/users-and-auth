import * as todoService from "../services/todo.service.js"

export const getTodos = async (req, res, next) => {
	try {
		const todos = await todoService.getAllTodos(req.user, req.query)
		res.json(todos)
	} catch (error) {
		next(error)
	}
}

export const getTodo = async (req, res, next) => {
	try {
		const todo = await todoService.getTodoById(req.params.id, req.user)
		res.json(todo)
	} catch (error) {
		next(error)
	}
}

export const createTodo = async (req, res, next) => {
  try {
    const todo = await todoService.createTodo(req.body, req.user, req.params.userId);
    res.status(201).json(todo);
  } catch (error) {
    next(error);
  }
};

// export const createTodo = async (req, res) => {
//   try {
//     const { title, description } = req.body;
    
//     const userId = req.user.id; 

//     const newTodo = await todoRepository.create({
//       title,
//       description,
//       userId: userId
//     });

//     res.status(201).json(newTodo);
//   } catch (error) {
//     res.status(500).json({ message: "Xatolik yuz berdi" });
//   }
// };

export const updateTodo = async (req, res, next) => {
	try {
		const todo = await todoService.updateTodo(req.params.id, req.body, req.user)
		res.json(todo)
	} catch (error) {
		next(error)
	}
}

export const deleteTodo = async (req, res, next) => {
	try {
		const todo = await todoService.deleteTodo(req.params.id, req.user)
		res.json({
			message: "Todo deleted",
			todo,
		})
	} catch (error) {
		next(error)
	}
}

import * as userService from "../services/user.service.js"

export const register = async (req, res, next) => {
	try {
		const result = await userService.register(req.body)
		res.status(201).json(result)
	} catch (error) {
		next(error)
	}
}

export const login = async (req, res, next) => {
	try {
		const result = await userService.login(req.body)
		res.json(result)
	} catch (error) {
		next(error)
	}
}

export const getUsers = async (req, res, next) => {
	try {
		const users = await userService.getAllUsers(req.query)
		res.json(users)
	} catch (error) {
		next(error)
	}
}

export const uploadUserImage = async (req, res, next) => {
	try {
		const file = req.file

		res.json({
			message: "File uploaded",
			filename: file.filename,
			path: file.path,
		})
	} catch (error) {
		next(error)
	}
}

export const getUser = async (req, res, next) => {
	try {
		const user = await userService.getUserById(req.params.id, req.user)
		res.json(user)
	} catch (error) {
		next(error)
	}
}

export const createUser = async (req, res, next) => {
	try {
		const user = await userService.createUser(req.body)
		res.status(201).json(user)
	} catch (error) {
		next(error)
	}
}

export const deleteUser = async (req, res, next) => {
	try {
		const deletedUser = await userService.deleteUser(req.params.id)

		res.json({
			message: "User deleted",
			user: deletedUser,
		})
	} catch (error) {
		next(error)
	}
}

// user.controller.js
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    const result = await userService.refreshAccessToken(refreshToken);

    res.json(result);
  } catch (error) {
    next(error);
  }
};
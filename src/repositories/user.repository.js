import { ILike } from "typeorm"
import { AppDataSource } from "../config/data-source.js"
import { UserEntity } from "../models/user.entity.js"

const getUserRepository = () => AppDataSource.getRepository(UserEntity)
const userRepository = getUserRepository()

export const findUsers = async (filters = {}, page = 1, limit = 10) => {
  const skip = (Number(page) - 1) * Number(limit);
  const take = Number(limit);

  return userRepository.find({
    where: filters,
    skip,
    take,
    select: {
      id: true,
      name: true,
      email: true,
      age: true,
      userImage: true,
      role: true,
      createdAt: true,
    }
  });
}

export const findAllUsers = async (filters = {}, page = 1, limit = 10) => {
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
  return userRepository.findOne({
    where: { id },
  })
}

export const findUserByEmail = async (email) => {
  return userRepository.findOne({
    where: { email: email.toLowerCase() },
  })
}

export const createUser = async (userData) => {
  const newUser = userRepository.create({
    ...userData,
    email: userData.email.toLowerCase(),
  })

  return userRepository.save(newUser)
}

export const deleteUserById = async (id) => {
  const userToDelete = await userRepository.findOneBy({ id })

  if (!userToDelete) {
    return null
  }

  return userRepository.remove(userToDelete)
}

// FORMATLANGAN VA TUZATILGAN BOT FUNKSIYALARI:

export const findUserByTelegramChatId = async (telegramChatId) => {
  // Endi userRepository globalda borligi uchun muammosiz ishlaydi
  return userRepository.findOneBy({ telegramChatId: String(telegramChatId) });
};

export const findAllUserChatId = async () => {
  return userRepository.find({ order: { telegramChatId: "DESC" } });
}

export const createUserFromBot = async ({ name, email, telegramChatId }) => {
  // Bu yerda ham global userRepository-dan foydalanamiz
  const user = userRepository.create({
    name,
    email,
    telegramChatId: String(telegramChatId), 
    password: "telegram-user", 
    role: "user",
  });
  
  // userRepo xatosi userRepository-ga almashtirildi
  return userRepository.save(user);
};
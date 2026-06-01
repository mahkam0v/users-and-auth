// src/bot/handlers/register.handler.js

// To'g'ri repozitoriy faylidan kerakli funksiyalarni import qilamiz
// Yo'li: handlers -> bot -> src -> repositories
import {
  findUserByTelegramChatId,
  createUserFromBot,
} from "../../repositories/user.repository.js"; 

const pendingUsers = new Map();

export const registerHandler = async (ctx) => {
  const chatId = ctx.from.id;

  try {
    const existing = await findUserByTelegramChatId(chatId);
    if (existing) {
      return ctx.reply(`✅ Siz allaqachon ro'yxatdansiz, ${existing.name}!`);
    }

    pendingUsers.set(chatId, { step: "name" });
    await ctx.reply("Ismingizni kiriting:");
  } catch (error) {
    console.error("Register Handler Error:", error);
    await ctx.reply("❌ Xatolik yuz berdi. Keyinroq urinib ko'ring.");
  }
};

export const registerTextHandler = async (ctx) => {
  const chatId = ctx.from.id;
  const pending = pendingUsers.get(chatId);

  if (!pending) return;

  if (pending.step === "name") {
    pending.name = ctx.message.text;
    pending.step = "email";
    pendingUsers.set(chatId, pending);
    return ctx.reply("Email manzilingizni kiriting:");
  }

  if (pending.step === "email") {
    try {
      const user = await createUserFromBot({
        name: pending.name,
        email: ctx.message.text,
        telegramChatId: chatId,
      });
      
      pendingUsers.delete(chatId);
      await ctx.reply(`🎉 Tabriklaymiz, ${user.name}! Ro'yxatdan o'tdingiz.`);
    } catch (error) {
      console.error("DB Register Error:", error);
      pendingUsers.delete(chatId);
      await ctx.reply("❌ Xatolik. Email allaqachon ro'yxatda bo'lishi mumkin.");
    }
  }
};
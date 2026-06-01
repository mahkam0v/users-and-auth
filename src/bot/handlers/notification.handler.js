import { findUserById } from "../../repositories/user.repository.js";

export const notifyHandler = async (ctx) => {
  const adminChatId = process.env.ADMIN_CHAT_ID;

  // 1. Admin tekshiruvi
  if (String(ctx.from.id) !== String(adminChatId)) {
    return ctx.reply("❌ Sizda bu buyruqni ishlatish huquqi yo'q!");
  }

  // 2. Argumentlarni olish: /notify <userId> <xabar>
  const args = ctx.message.text.split(" ").slice(1);
  const userId = args[0];
  const message = args.slice(1).join(" ");

  if (!userId || !message) {
    return ctx.reply("⚠️ To'g'ri format: /notify <userId> <xabar>");
  }

  // 3. Userni topish
  const user = await findUserById(userId);

  if (!user) {
    return ctx.reply(`❌ ID: ${userId} bo'lgan user topilmadi!`);
  }

  if (!user.telegramChatId) {
    return ctx.reply(`❌ Bu userning Telegram chatId si yo'q!`);
  }

  // 4. Xabar yuborish
  try {
    await ctx.telegram.sendMessage(user.telegramChatId, `📩 Admin xabari:\n\n${message}`);
    ctx.reply(`✅ Xabar muvaffaqiyatli yuborildi! (User: ${user.name})`);
  } catch (err) {
    console.error("Xabar yuborishda xato:", err);
    ctx.reply("❌ Xabar yuborib bo'lmadi. User botni bloklagan bo'lishi mumkin.");
  }
};
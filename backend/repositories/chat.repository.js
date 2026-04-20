import { supabase } from "../config/supabase.js";

export class ChatRepository {
  static async createMessage(messageData) {
    const { data, error } = await supabase
      .from("chat_messages")
      .insert([messageData])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getRecentMessages(userId, planId = null, limit = 10) {
    let query = supabase
      .from("chat_messages")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(limit);

    if (planId) {
      query = query.eq("plan_id", planId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  }
}

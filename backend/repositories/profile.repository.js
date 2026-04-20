import { supabase } from "../config/supabase.js";

export class ProfileRepository {
  static async getProfile(userId) {
    const { data, error } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'not found'
    return data;
  }

  static async upsertProfile(profileData) {
    const { data, error } = await supabase
      .from("user_profiles")
      .upsert(profileData)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async logWeight(userId, weight) {
    const { data, error } = await supabase
      .from("weight_history")
      .insert([{ user_id: userId, weight }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async getWeightHistory(userId) {
    const { data, error } = await supabase
      .from("weight_history")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  }
}

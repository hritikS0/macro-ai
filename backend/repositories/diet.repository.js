import { supabase } from "../config/supabase.js";

export class DietRepository {
  static async getActivePlan(userId) {
    const { data, error } = await supabase
      .from("diet_plans")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;
    return data;
  }

  static async upsertActivePlan(userId, dietData) {
    const existing = await this.getActivePlan(userId);

    if (existing) {
      const { data, error } = await supabase
        .from("diet_plans")
        .update(dietData)
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from("diet_plans")
        .insert([{ ...dietData, user_id: userId }])
        .select()
        .single();
      if (error) throw error;
      return data;
    }
  }

  static async deleteActivePlan(userId) {
    const { error } = await supabase
      .from("diet_plans")
      .delete()
      .eq("user_id", userId);
    if (error) throw error;
  }

}

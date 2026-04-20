import { NutritionService } from "./nutrition.service.js";
import { AIService } from "./ai.service.js";
import { ValidationService } from "./validation.service.js";
import { DietRepository } from "../repositories/diet.repository.js";

export class DietService {
  static async generateDietPlan(userData, userId) {
    const { age, weight, height, goal, gender, preferences, dietType } =
      userData;

    // 1. Calculate Metrics
    const bmr = NutritionService.calculateBMR(age, weight, height, gender);
    const tdee = NutritionService.calculateTDEE(bmr);
    const targetCalories = NutritionService.computeTargetCalories(tdee, goal);

    // 2. Prepare Prompt
    const prompt = `
      Create a highly personalized diet plan and a 6-day tactical workout split for a user with these stats:
      - Age: ${age}, Gender: ${gender}, Weight: ${weight}kg, Height: ${height}cm
      - Goal: ${goal}, Diet Type: ${dietType || "Non-Vegetarian"}
      - Target Calories: ${Math.round(targetCalories)} kcal
      - Preferences: ${preferences || "None"}

      Return ONLY a JSON object with this exact schema:
      {
        "calories": number,
        "macros": { "protein": number, "carbs": number, "fat": number },
        "meals": [
          {
            "name": "Breakfast" | "Lunch" | "Dinner" | "Snack",
            "calories": number,
            "items": [{ "name": "string", "quantity": "string", "calories": number }]
          }
        ],
        "workout_plan": [
          { 
            "day": "Day 1" | "Day 2" | "Day 3" | "Day 4" | "Day 5" | "Day 6", 
            "focus": "string", 
            "exercises": [{ "name": "string", "sets": "string", "reps": "string" }] 
          }
        ]
      }
      MANDATORY REQUIREMENTS:
      1. Generate 4 meals total.
      2. Generate exactly 6 workout days (Day 1 to Day 6). Use "Rest/Active Recovery" for rest days if needed, but the array must have 6 items.
      3. Ensure all calories and macros are accurate.
    `;


    // 3. Call AI with Retry logic
    let aiResult = null;
    let attempts = 0;
    const maxRetries = 3;

    while (attempts < maxRetries && !aiResult) {
      try {
        const rawOutput = await AIService.generateText(prompt);
        aiResult = ValidationService.parseAIOutput(rawOutput);
      } catch (err) {
        console.error(`Attempt ${attempts + 1} failed:`, err.message);
      }
      attempts++;
    }

    if (!aiResult) {
      throw new Error("Failed to generate valid plan after multiple attempts");
    }

    // 4. Save to Repository (Single Plan Flow)
    const dietRecord = {
      age,
      weight,
      height,
      goal,
      bmr,
      tdee,
      target_calories: targetCalories,
      ai_output: aiResult,
    };

    return await DietRepository.upsertActivePlan(userId, dietRecord);
  }

  static async regenerateMeal(userId, mealName, instruction) {
    const activePlan = await DietRepository.getActivePlan(userId);
    if (!activePlan) throw new Error("No active plan found to regenerate");

    const prompt = `
      Update ONLY the meal "${mealName}" based on: "${instruction}"
      
      CONTEXT:
      - Current Plan: ${JSON.stringify(activePlan.ai_output)}
      
      RULES:
      1. Modify ONLY the "items" and "calories" for "${mealName}".
      2. Keep ALL other meals and the "workout_plan" exactly as they are.
      3. Recalculate the overall "calories" and "macros" based on the new ${mealName}.
      4. Ensure the new total calories remain within ±10% of the target if possible.
      5. Return the FULL updated JSON matching the original schema.
    `;

    const rawOutput = await AIService.generateText(prompt);
    const updatedAIOutput = ValidationService.parseAIOutput(rawOutput);

    return await DietRepository.upsertActivePlan(userId, { 
      ...activePlan, 
      ai_output: updatedAIOutput,
      id: undefined, // ensure we don't accidentally try to set id in the update body if it's there
      created_at: undefined
    });
  }

  static async regenerateWorkout(userId, dayName, instruction) {
    const activePlan = await DietRepository.getActivePlan(userId);
    if (!activePlan) throw new Error("No active plan found to regenerate");

    const prompt = `
      Update ONLY the workout for "${dayName}" based on: "${instruction}"
      
      CONTEXT:
      - Current Plan: ${JSON.stringify(activePlan.ai_output)}
      
      RULES:
      1. Modify ONLY the exercises/focus for "${dayName}" in the workout_plan.
      2. Keep ALL meals and other workout days exactly as they are.
      3. Return the FULL updated JSON matching the original schema.
    `;

    const rawOutput = await AIService.generateText(prompt);
    const updatedAIOutput = ValidationService.parseAIOutput(rawOutput);

    return await DietRepository.upsertActivePlan(userId, { 
      ...activePlan, 
      ai_output: updatedAIOutput,
      id: undefined,
      created_at: undefined
    });
  }


  static async getActivePlan(userId) {
    return await DietRepository.getActivePlan(userId);
  }

  static async deleteDietPlan(userId) {
    return await DietRepository.deleteActivePlan(userId);
  }
}


export class NutritionService {
  /**
   * Calculate BMR using Mifflin-St Jeor Formula
   */
  static calculateBMR(age, weight, height, gender) {
    if (gender.toLowerCase() === 'male') {
      return (10 * weight) + (6.25 * height) - (5 * age) + 5;
    } else {
      return (10 * weight) + (6.25 * height) - (5 * age) - 161;
    }
  }

  /**
   * Calculate TDEE (Total Daily Energy Expenditure)
   * Activity levels: 1.2 (Sedentary), 1.375 (Lightly active), 1.55 (Moderately active), 1.725 (Very active)
   * Defaulting to 1.2 for conservative estimates.
   */
  static calculateTDEE(bmr, activityMultiplier = 1.2) {
    return bmr * activityMultiplier;
  }

  /**
   * Compute target calories based on goal
   */
  static computeTargetCalories(tdee, goal) {
    switch (goal.toLowerCase()) {
      case 'weight loss':
      case 'fat loss':
        return tdee - 500;
      case 'weight gain':
      case 'muscle gain':
        return tdee + 500;
      case 'maintenance':
      default:
        return tdee;
    }
  }
}

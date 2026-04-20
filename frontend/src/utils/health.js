/**
 * Scientific Health Utility Functions
 */

/**
 * Calculate BMI (Body Mass Index)
 * Formula: weight (kg) / [height (m)]^2
 */
export const calculateBMI = (weight, height) => {
  if (!weight || !height) return 0;
  const heightInMeters = height / 100;
  return (weight / (heightInMeters * heightInMeters)).toFixed(1);
};

/**
 * Get BMI category and color
 */
export const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#f59e0b', description: 'Below healthy range' };
  if (bmi < 25) return { label: 'Healthy', color: '#10b981', description: 'Ideal metabolic zone' };
  if (bmi < 30) return { label: 'Overweight', color: '#f59e0b', description: 'Above healthy range' };
  return { label: 'Obese', color: '#ef4444', description: 'Significantly above range' };
};

/**
 * Calculate BMR (Basal Metabolic Rate) - Mifflin-St Jeor Equation
 */
export const calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age) return 0;
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  return Math.round(bmr);
};

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export const calculateTDEE = (bmr, activityLevel) => {
  const factors = {
    'Sedentary': 1.2,
    'Light': 1.375,
    'Moderate': 1.55,
    'Very': 1.725,
    'Extra': 1.9
  };
  const factor = factors[activityLevel] || 1.2;
  return Math.round(bmr * factor);
};

/**
 * Calculate Ideal Weight Range (based on BMI 18.5 - 24.9)
 */
export const calculateIdealWeightRange = (height) => {
  if (!height) return { min: 0, max: 0 };
  const hMeters = height / 100;
  return {
    min: Math.round(18.5 * (hMeters * hMeters)),
    max: Math.round(24.9 * (hMeters * hMeters))
  };
};

/**
 * Calculate Daily Water Intake (approx 35ml per kg)
 */
export const calculateWaterIntake = (weight) => {
  if (!weight) return 0;
  return Math.round(weight * 35);
};

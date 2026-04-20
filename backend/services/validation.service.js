export class ValidationService {
  /**
   * Safely parse JSON from AI output
   * Cleans common AI formatting like ```json ... ``` blocks
   */
  static parseAIOutput(text) {
    if (!text) return null;

    try {
      // Remove possible markdown code blocks
      const cleanJson = text.replace(/```json|```/g, '').trim();
      
      const parsed = JSON.parse(cleanJson);

      // Validate basic structure
      if (parsed.calories && parsed.macros && parsed.meals && parsed.workout_plan) {
        return parsed;
      }
      
      return null;
    } catch (err) {
      console.warn('JSON Parsing failed for AI output:', err.message);
      
      // Attempt to find JSON within the text if parsing failed
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[0]);
        } catch {
          return null;
        }
      }
      
      return null;
    }
  }
}

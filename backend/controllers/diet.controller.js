import { DietService } from '../services/diet.service.js';
import { ChatRepository } from '../repositories/chat.repository.js';
import { AIService } from '../services/ai.service.js';
import PdfService from '../services/pdf.service.js';

export class DietController {
  static async generate(req, res) {
    try {
      const userData = req.body;
      const userId = req.user.id;
      if (!userData.age || !userData.weight || !userData.height || !userData.goal || !userData.gender) {
        return res.status(400).json({ error: 'Missing required user metrics' });
      }
      const dietPlan = await DietService.generateDietPlan(userData, userId);
      res.status(201).json(dietPlan);
    } catch (error) {
      console.error('Diet Generation Controller Error:', error.message);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  static async getActivePlan(req, res) {
    try {
      const userId = req.user.id;
      const plan = await DietService.getActivePlan(userId);
      res.status(200).json(plan);
    } catch (error) {
      console.error('Get Active Plan Controller Error:', error.message);
      res.status(500).json({ error: 'Failed to fetch active plan' });
    }
  }

  static async delete(req, res) {
    try {
      const userId = req.user.id;
      await DietService.deleteDietPlan(userId);
      res.status(204).send();
    } catch (error) {
      console.error('Diet Deletion Controller Error:', error.message);
      res.status(500).json({ error: 'Failed to delete diet plan' });
    }
  }

  static async regenerate(req, res) {
    try {
      const { mealName, dayName, instruction } = req.body;
      const userId = req.user.id;

      if (!instruction) {
        return res.status(400).json({ error: 'Instruction is required' });
      }

      let updatedPlan;
      if (mealName) {
        updatedPlan = await DietService.regenerateMeal(userId, mealName, instruction);
      } else if (dayName) {
        updatedPlan = await DietService.regenerateWorkout(userId, dayName, instruction);
      } else {
        return res.status(400).json({ error: 'Either mealName or dayName is required' });
      }

      res.status(200).json(updatedPlan);
    } catch (error) {
      console.error('Regeneration Controller Error:', error.message);
      res.status(500).json({ error: 'Failed to regenerate section' });
    }
  }


  static async chat(req, res) {
    try {
      const { message } = req.body;
      const userId = req.user.id;
      const plan = await DietService.getActivePlan(userId);
      const planContext = plan ? JSON.stringify(plan.ai_output) : "";
      const history = await ChatRepository.getRecentMessages(userId, plan?.id, 6);
      const aiMessages = history.map(m => ({ role: m.role, content: m.content }));
      aiMessages.push({ role: 'user', content: message });
      const response = await AIService.chat(aiMessages, planContext);
      await ChatRepository.createMessage({ user_id: userId, plan_id: plan?.id, role: 'user', content: message });
      const aiRecord = await ChatRepository.createMessage({ user_id: userId, plan_id: plan?.id, role: 'assistant', content: response });
      res.status(200).json(aiRecord);
    } catch (error) {
      console.error('Chat Controller Error:', error.message);
      res.status(500).json({ error: 'AI Coach is busy right now' });
    }
  }

  static async getChatHistory(req, res) {
    try {
      const userId = req.user.id;
      const plan = await DietService.getActivePlan(userId);
      const limit = Math.min(Number(req.query.limit || 20), 50);
      const before = req.query.before || undefined;
      const history = await ChatRepository.getMessagesPage(userId, plan?.id, { limit, before });
      const nextBefore = history.length > 0 ? history[0].created_at : null;
      res.status(200).json({ messages: history, nextBefore });
    } catch (error) {
       res.status(500).json({ error: error.message || 'Failed to fetch chat history' });
    }
  }

  static async exportPdf(req, res) {
    try {
      const planData = req.body;
      if (!planData) {
        return res.status(400).json({ error: 'Missing plan data' });
      }

      const pdfBuffer = await PdfService.generateDietPdf(planData);
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="optimal-protocol.pdf"');
      res.end(pdfBuffer);
    } catch (error) {
      console.error('PDF Export Controller Error:', error);
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }
}

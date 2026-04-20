import { ProfileRepository } from '../repositories/profile.repository.js';

export class ProfileController {
  static async get(req, res) {
    try {
      const userId = req.user.id;
      const profile = await ProfileRepository.getProfile(userId);
      res.status(200).json(profile);
    } catch (error) {
      console.error('Profile Fetch Controller Error:', error.message);
      res.status(500).json({ error: 'Failed to fetch profile' });
    }
  }

  static async update(req, res) {
    try {
      const userId = req.user.id;
      const profileData = { ...req.body, user_id: userId, updated_at: new Date() };
      
      const profile = await ProfileRepository.upsertProfile(profileData);
      
      // If weight is provided, log it in history too
      if (req.body.weight) {
        await ProfileRepository.logWeight(userId, req.body.weight);
      }
      
      res.status(200).json(profile);
    } catch (error) {
      console.error('Profile Update Controller Error:', error.message);
      res.status(500).json({ error: 'Failed to update profile' });
    }
  }

  static async getWeightHistory(req, res) {
    try {
      const userId = req.user.id;
      const history = await ProfileRepository.getWeightHistory(userId);
      res.status(200).json(history);
    } catch (error) {
      console.error('Weight History Controller Error:', error.message);
      res.status(500).json({ error: 'Failed to fetch weight history' });
    }
  }
}

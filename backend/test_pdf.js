import PdfService from './services/pdf.service.js';
import fs from 'fs/promises';

async function testPdf() {
  try {
    console.log('Testing PDF Generation...');
    const dummyData = {
      weight: 80,
      height: 180,
      goal: 'Fat Loss',
      ai_output: {
        calories: 2000,
        macros: { protein: 150, carbs: 150, fats: 50 },
        meals: [
          { name: 'Test Meal', calories: 500, items: [{name: 'Chicken', quantity: '200g', calories: 300}] }
        ],
        workout_plan: [
          { day: 'Day 1', focus: 'Chest', exercises: [{name: 'Pushup', sets: 3, reps: 10}] }
        ]
      }
    };

    const pdfBuffer = await PdfService.generateDietPdf(dummyData);
    await fs.writeFile('test.pdf', pdfBuffer);
    console.log('PDF Generated Successfully!');
  } catch (error) {
    console.error('PDF GENERATION FAILED:');
    console.error(error);
  }
}

testPdf();

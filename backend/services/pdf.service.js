import puppeteer from 'puppeteer';
import handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PdfService {
  /**
   * Generates a PDF buffer from the provided diet plan JSON
   * @param {Object} planData 
   * @returns {Promise<Buffer>}
   */
  async generateDietPdf(planData) {
    try {
      // 1. Read Template
      const templatePath = path.join(__dirname, '../templates/pdf_template.hbs');
      const templateHtml = await fs.readFile(templatePath, 'utf8');

      // 2. Compile with Handlebars
      const template = handlebars.compile(templateHtml);

      const aiData = planData.ai_output || {};
      
      const bmi = planData.weight && planData.height 
        ? (planData.weight / Math.pow(planData.height / 100, 2)).toFixed(1)
        : 'N/A';

      const renderData = {
        goal: planData.goal || 'General Health',
        weight: planData.weight,
        bmi: bmi,
        calories: Math.round(aiData.calories || 0),
        macros: {
          protein: aiData.macros?.protein || 0,
          carbs: aiData.macros?.carbs || 0,
          fat: aiData.macros?.fat || aiData.macros?.fats || 0
        },
        meals: aiData.meals || [],
        workout_plan: aiData.workout_plan || []
      };

      const finalHtml = template(renderData);

      // 3. Launch Puppeteer
      const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });

      const page = await browser.newPage();
      await page.setContent(finalHtml, { waitUntil: 'networkidle0' });

      // 4. Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '20mm',
          bottom: '20mm',
          left: '20mm',
          right: '20mm'
        }
      });

      await browser.close();

      return pdfBuffer;

    } catch (error) {
      console.error('PdfService Error:', error);
      throw error;
    }
  }
}

export default new PdfService();

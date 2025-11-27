
import { GoogleGenerativeAI } from "@google/generative-ai";
import { AggregatedStats } from "../types";
import { QUESTIONS, STYLES } from "../constants";

export const analyzeAudience = async (stats: AggregatedStats): Promise<string> => {
  try {
    const ai = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY || "");
    
    // Summary of Styles
    const styleSummary = Object.entries(stats.styleDistribution)
      .map(([style, count]) => `- ${style}: ${count} people (${Math.round(count/stats.totalParticipants * 100)}%)`)
      .join('\n');

    // Summary of Top Qualities (Q4)
    const q4Stats = stats.questionStats['q4'] || {};
    const q4Options = QUESTIONS.find(q => q.id === 'q4')?.options || [];
    const topQualities = q4Options
      .map(opt => ({ text: opt.text, count: q4Stats[opt.id] || 0 }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
      .map(item => `${item.text} (${item.count} votes)`)
      .join(', ');

    const prompt = `
      You are an expert Management Trainer conducting a live workshop.
      You have just surveyed the ${stats.totalParticipants} participants in the room.
      
      Here is the real-time data breakdown:
      
      ### Management Style Distribution (Dominant Tendencies):
      ${styleSummary}
      
      ### Top 3 Valued Management Qualities (What they value):
      ${topQualities}
      
      ### Your Task:
      1. **Audience Profile**: Briefly characterize the "personality" of this class based on the dominant styles. (e.g., "A highly execution-focused group" or "A relationship-heavy group").
      2. **Teaching Adjustment**: Give me 3 specific tips on how I should adjust my delivery *right now*. 
         - If they are 'Result' heavy, should I speed up? 
         - If they are 'Process' heavy, should I provide more data?
      3. **Engagement Question**: Suggest 1 thought-provoking question I can ask the audience immediately to spark a debate between the different style groups.

      Keep the response structured, professional, yet punchy for a live presenter to read quickly. Output in Markdown.
    `;

    const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const response = await model.generateContent(prompt);

    return response.response.text() || "Unable to generate insights.";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI service temporarily unavailable. Please check your network or API Key.";
  }
};

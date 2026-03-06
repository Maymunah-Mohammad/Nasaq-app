import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { type, selectedDays, selectedTimes, branch } = await req.json();

        // 1. The Easter Egg Error Rule (hardcoded to guarantee UX consistency as requested by user)
        if (selectedDays.length === 1 && selectedDays[0] === 'الجمعة') {
            return NextResponse.json({
                error: true,
                message: 'عذراً، لا توجد مواعيد متاحة في هذا الفرع حالياً. جرب اختيار يوم آخر'
            });
        }

        // 2. Prepare prompt for Gemini
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        let promptConfig = '';
        if (type === 'receive') {
            promptConfig = `Context: User wants to RECEIVE a parcel. They MUST go to "${branch || 'فرع العليا'}" only. Suggest times for this branch specifically.`;
        } else {
            promptConfig = 'Context: User wants to SEND a parcel. You can suggest any suitable branch ideally close to central Riyadh like "فرع الملك عبدالله", "فرع الملز", "فرع الصحافة". Make one the absolute closest/fastest.';
        }

        const prompt = `
            You are "Nasaq AI", an intelligent logistics scheduling assistant for SPL (Saudi Post).
            ${promptConfig}
            
            The user wants an appointment in one of these days: ${selectedDays.join(' or ')}.
            The user wants an appointment in one of these time slots: ${selectedTimes.join(' or ')}.
            
            Return exactly TWO highly specific recommended appointments as a JSON array. 
            Do NOT return markdown framing (no \`\`\`json). Just the raw JSON array.
            
            The structure of each object in the array must be exactly:
            {
                "day": "One of the selected days",
                "timeString": "A specific time like '10:30 ص' or '02:15 م' matching their requested time slot",
                "branch": "The specific branch name",
                "congestionLevel": "Either 'منخفض' (low) for the best one, or 'متوسط' (medium)",
                "isBest": true or false (Only the first one should be true)
            }
            
            Ensure the output is in Arabic matching the user's language.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        // Strip out any potential markdown codeblocks Gemini might wrap it in despite instructions
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        const recommendations = JSON.parse(cleanedText);

        return NextResponse.json({
            error: false,
            recommendations: recommendations
        });

    } catch (error) {
        console.error('AI Error:', error);
        return NextResponse.json(
            { error: true, message: 'حدث خطأ في محرك الذكاء الاصطناعي، يرجى المحاولة مرة أخرى.' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';

// Initialize the client on demand to ensure env vars are loaded correctly in production
const getGenAI = () => new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(req: Request) {
    try {
        const { type, selectedDays, selectedTimes, branch, count = 2 } = await req.json();

        // 1. The Easter Egg Error Rule (hardcoded to guarantee UX consistency as requested by user)
        if (selectedDays.length === 1 && selectedDays[0] === 'الجمعة') {
            return NextResponse.json({
                error: true,
                message: 'عذراً، لا توجد مواعيد متاحة في هذا الفرع حالياً. جرب اختيار يوم آخر'
            });
        }

        // 2. Resolve API Key from multiple potential names (including exact case from .env)
        const apiKey = process.env.Gemini_API_Key || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;

        if (!apiKey) {
            console.warn('MISSING GOOGLE_API_KEY environment variable. Falling back to Demo Mode.');

            // DEMO MODE: To ensure the app is "Always Live" for the user, return simulated AI results
            const demoRecommendations = [
                {
                    "day": selectedDays[0] || 'الأحد',
                    "date": "10-05-2026",
                    "timeString": selectedTimes[0] === 'صباحاً' ? '10:15 ص' : '02:30 م',
                    "branch": branch || (type === 'receive' ? 'فرع العليا' : 'فرع السليمانية'),
                    "congestionLevel": "منخفض",
                    "isBest": true
                },
                {
                    "day": selectedDays[selectedDays.length - 1] || 'الاثنين',
                    "date": "11-05-2026",
                    "timeString": selectedTimes[0] === 'صباحاً' ? '11:45 ص' : '04:15 م',
                    "branch": type === 'receive' ? (branch || 'فرع العليا') : 'فرع الورود',
                    "congestionLevel": "متوسط",
                    "isBest": false
                }
            ];

            return NextResponse.json({
                error: false,
                isDemo: true,
                recommendations: demoRecommendations
            });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: { responseMimeType: 'application/json' }
        }); // Guarantee valid JSON output from API

        // 3. Fetch Real-Time Congestion Data from Prisma!
        const olayaCount = await prisma.appointment.count({ where: { branch: 'فرع العليا' } });
        const sulaimaniyahCount = await prisma.appointment.count({ where: { branch: 'فرع السليمانية' } });
        const wurudCount = await prisma.appointment.count({ where: { branch: 'فرع الورود' } });
        const takhasusiCount = await prisma.appointment.count({ where: { branch: 'فرع التخصصي' } });

        let promptConfig = '';
        if (type === 'receive') {
            const currentBranchCount = await prisma.appointment.count({ where: { branch: branch || 'فرع العليا' } });
            promptConfig = `Context: User wants to RECEIVE a parcel. They MUST go to "${branch || 'فرع العليا'}" (Al Olaya Branch, Riyadh) only. The current number of appointments booked for this branch is ${currentBranchCount}. Suggest times for this branch specifically.`;
        } else {
            promptConfig = `
                Context: User wants to SEND a parcel. The user is located in "Al Olaya, Riyadh". 
                You must suggest the closest and most suitable branches from the live data below.
                
                LIVE DATABASE CONGESTION DATA (Current Total Appointments booked):
                - 'فرع العليا': ${olayaCount} appointments
                - 'فرع السليمانية': ${sulaimaniyahCount} appointments
                - 'فرع الورود': ${wurudCount} appointments
                - 'فرع التخصصي': ${takhasusiCount} appointments

                You MUST suggest exactly two DIFFERENT branches from the live data list above. 
                The branch that has the LOWEST number of appointments out of those options MUST be your absolute first ("isBest": true) recommendation, with its "congestionLevel" accurately labeled as 'منخفض' (Low). 
                The branch with a slightly higher relative number of appointments should be your second recommendation, with its "congestionLevel" labeled as 'متوسط' (Medium). 
            `;
        }

        const prompt = `
            You are "Nasaq AI", an intelligent logistics scheduling assistant for SPL (Saudi Post).
            ${promptConfig}
            
            Today's Date: ${new Date().toLocaleDateString('en-GB')}
            The user wants an appointment in one of these days: ${selectedDays.join(' or ')}.
            The user wants an appointment in one of these time slots: ${selectedTimes.join(' or ')}.
            
            Return exactly ${count} highly specific recommended appointments as a JSON array. 
            Do NOT return markdown framing (no \`\`\`json). Just the raw JSON array.
            
            The structure of each object in the array must be exactly:
            {
                "day": "One of the selected days",
                "date": "The exact calendar date of the upcoming selected day formatted as DD-MM-YYYY",
                "timeString": "A specific time like '10:30 ص' or '02:15 م' matching their requested time slot",
                "branch": "The specific branch name",
                "congestionLevel": "Either 'منخفض' (low) for the best one, or 'متوسط' (medium)",
                "isBest": true or false (Only the first one should be true)
            }
            
            Ensure the output is in Arabic matching the user's language.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text().trim();

        console.log("Gemini Raw Response in Production:", text);

        // Strip out any potential markdown codeblocks Gemini might wrap it in despite instructions
        const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

        // Safely extract the JSON array using regex just in case there is text before/after
        const arrayMatch = cleanedText.match(/\[[\s\S]*\]/);
        const jsonToParse = arrayMatch ? arrayMatch[0] : cleanedText;

        const recommendations = JSON.parse(jsonToParse);

        return NextResponse.json({
            error: false,
            recommendations: recommendations
        });

    } catch (error: any) {
        console.error('AI Error trace:', error);
        return NextResponse.json(
            { error: true, message: 'حدث خطأ في محرك الذكاء الاصطناعي، يرجى المحاولة مرة أخرى.', details: error?.message || "Unknown error" },
            { status: 500 }
        );
    }
}

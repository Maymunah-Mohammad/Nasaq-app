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

        // 3. SECURE LIVE COUNTS: Fetch Real-Time Congestion Data from Prisma FIRST!
        const olayaCount = await prisma.appointment.count({ where: { branch: 'فرع العليا' } });
        const sulaimaniyahCount = await prisma.appointment.count({ where: { branch: 'فرع السليمانية' } });
        const wurudCount = await prisma.appointment.count({ where: { branch: 'فرع الورود' } });
        const takhasusiCount = await prisma.appointment.count({ where: { branch: 'فرع التخصصي' } });

        // Maintain a live lookup dictionary
        const liveCountsMap: Record<string, number> = {
            'فرع العليا': olayaCount,
            'فرع السليمانية': sulaimaniyahCount,
            'فرع الورود': wurudCount,
            'فرع التخصصي': takhasusiCount
        };

        if (branch && !liveCountsMap[branch]) {
            liveCountsMap[branch] = await prisma.appointment.count({ where: { branch: branch } });
        }

        // 2. Resolve API Key
        const apiKey = process.env.Gemini_API_Key || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY || process.env.API_KEY;

        if (!apiKey) {
            console.warn('MISSING GOOGLE_API_KEY environment variable. Falling back to Demo Mode.');

            const demoBranch1 = branch || (type === 'receive' ? 'فرع العليا' : 'فرع السليمانية');
            const demoBranch2 = type === 'receive' ? (branch || 'فرع العليا') : 'فرع الورود';

            // DEMO MODE: To ensure the app is "Always Live" for the user, return simulated AI results
            const demoRecommendations = [
                {
                    "day": selectedDays[0] || 'الأحد',
                    "date": "10-05-2026",
                    "timeString": selectedTimes[0] === 'صباحاً' ? '10:15 ص' : '02:30 م',
                    "branch": demoBranch1,
                    "congestionLevel": "منخفض",
                    "appointmentCount": liveCountsMap[demoBranch1] || 0,
                    "isBest": true
                },
                {
                    "day": selectedDays[selectedDays.length - 1] || 'الاثنين',
                    "date": "11-05-2026",
                    "timeString": selectedTimes[0] === 'صباحاً' ? '11:45 ص' : '04:15 م',
                    "branch": demoBranch2,
                    "congestionLevel": "متوسط",
                    "appointmentCount": liveCountsMap[demoBranch2] || 0,
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

        let promptConfig = '';
        if (type === 'receive') {
            const currentBranchCount = liveCountsMap[branch || 'فرع العليا'];
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
                "appointmentCount": "The exact integer number of appointments for this specific branch from the LIVE DATABASE CONGESTION DATA. (Number only)",
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

        // Security Override: Explicitly inject the correct Postgres counts to overwrite AI hallucinations
        for (let rec of recommendations) {
            const safeBranch = rec.branch;

            try {
                // 1. Parse date "DD-MM-YYYY" from AI
                const [dayStr, monthStr, yearStr] = rec.date.split('-');
                let hourOfDay = 12;

                // 2. Parse timeString "10:30 ص" into 24-hour integer
                const hourMatch = rec.timeString.match(/(\d+):/);
                if (hourMatch) {
                    let h = parseInt(hourMatch[1], 10);
                    if (rec.timeString.includes('ص')) {
                        hourOfDay = h === 12 ? 0 : h;
                    } else if (rec.timeString.includes('م')) {
                        hourOfDay = h === 12 ? 12 : h + 12;
                    }
                }

                const year = parseInt(yearStr, 10);
                const month = parseInt(monthStr, 10) - 1; // JS months are 0-indexed
                const day = parseInt(dayStr, 10);

                // 3. Create exact Date boundaries for the ENTIRE day!
                const startOfDay = new Date(year, month, day, 0, 0, 0);
                const endOfDay = new Date(year, month, day, 23, 59, 59);

                // 4. Query PostgreSQL for exact registrations during this entire day
                const strictDayCount = await prisma.appointment.count({
                    where: {
                        branch: safeBranch,
                        date: {
                            gte: startOfDay,
                            lte: endOfDay
                        }
                    }
                });

                // Create exact Date boundaries for that specific hour of that day
                const startOfHour = new Date(year, month, day, hourOfDay, 0, 0);
                const endOfHour = new Date(year, month, day, hourOfDay, 59, 59);

                const strictHourCount = await prisma.appointment.count({
                    where: {
                        branch: safeBranch,
                        date: {
                            gte: startOfHour,
                            lte: endOfHour
                        }
                    }
                });

                rec.appointmentCount = strictDayCount;
                rec.hourAppointmentCount = strictHourCount;

                // 4b. Generate the exact Hour-by-Hour Breakdown for the specific period grid
                const periodHours = [];
                if (rec.timeString.includes('ص')) {
                    periodHours.push(8, 9, 10, 11);
                } else {
                    const h = parseInt(hourMatch ? hourMatch[1] : '1', 10);
                    if (h === 12 || h <= 3) {
                        periodHours.push(12, 13, 14, 15); // 12 PM - 3 PM
                    } else {
                        periodHours.push(16, 17, 18, 19, 20); // 4 PM - 8 PM
                    }
                }

                const hourlyBreakdown = [];
                for (let ph of periodHours) {
                    const sHour = new Date(year, month, day, ph, 0, 0);
                    const eHour = new Date(year, month, day, ph, 59, 59);
                    const ct = await prisma.appointment.count({
                        where: { branch: safeBranch, date: { gte: sHour, lte: eHour } }
                    });

                    let label = ph === 0 || ph === 12 ? 12 : (ph > 12 ? ph - 12 : ph);
                    let suffix = ph >= 12 && ph < 24 ? 'م' : 'ص';
                    let padLabel = label.toString().padStart(2, '0');
                    hourlyBreakdown.push({ time: `${padLabel}:00 ${suffix}`, count: ct });
                }

                rec.hourlyBreakdown = hourlyBreakdown;

            } catch (e) {
                // Fallback to total branch count if date parsing fails
                if (liveCountsMap[safeBranch] !== undefined) {
                    rec.appointmentCount = liveCountsMap[safeBranch];
                    rec.hourAppointmentCount = 0;
                    rec.hourlyBreakdown = [];
                } else {
                    const adHocCount = await prisma.appointment.count({ where: { branch: safeBranch } });
                    rec.appointmentCount = adHocCount;
                    rec.hourAppointmentCount = 0;
                    rec.hourlyBreakdown = [];
                }
            }
        }

        // 5. Mathematically re-evaluate "isBest" and "congestionLevel" based on the REAL counts 
        // to prevent UI mismatch. First sort by the HOUR congestion, then by the DAY congestion.
        recommendations.sort((a: any, b: any) => {
            if (a.hourAppointmentCount !== b.hourAppointmentCount) {
                return a.hourAppointmentCount - b.hourAppointmentCount;
            }
            return a.appointmentCount - b.appointmentCount;
        });

        // After sorting, the lowest count is guaranteed to be at index 0.
        for (let i = 0; i < recommendations.length; i++) {
            const hourCount = recommendations[i].hourAppointmentCount;
            // The absolute minimum in the array is at index 0
            if (i === 0) {
                recommendations[i].isBest = true;
            } else {
                recommendations[i].isBest = false;
            }

            // Dynamic thresholding for congestion levels based on HOUR count:
            if (hourCount <= 2) {
                recommendations[i].congestionLevel = 'منخفض';
            } else if (hourCount <= 5) {
                recommendations[i].congestionLevel = 'متوسط';
            } else {
                recommendations[i].congestionLevel = 'عالي';
            }
        }

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

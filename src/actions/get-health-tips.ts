"use server";

import { Symptom, Medication, User } from "@prisma/client";

interface Props {
    symptoms: Symptom[];
    medications: Medication[];
    user: User;
}

const generateTips = ({ symptoms, medications, user }: Props) => {
    const { age, bloodGroup, firstName, gender, height, medicalIssues, weight } = user;

    const formattedSymptoms = symptoms.map(symptom => {
        return `- ${symptom.name} (Intensity: ${symptom.intensity}, Frequency: ${symptom.frequency})`;
    }).join("\n");

    const formattedMedications = medications.map(medication => {
        return `- ${medication.name} (Dosage: ${medication.dosage}, Frequency: ${medication.frequency})`;
    }).join("\n");

    const prompt = `
        The user ${firstName ? firstName : ""} is ${age ? `${age} years old` : "of unknown age"}, ${gender ? gender : "of unknown gender"}. 
        Their blood group is ${bloodGroup ? bloodGroup : "unknown"}, height is ${height ? `${height} cm` : "unknown"}, and weight is ${weight ? `${weight} kg` : "unknown"}. 
        They have the following medical issues: ${medicalIssues ? medicalIssues : "none reported"}.

        Here are the details of their health condition:

        Symptoms:
        ${formattedSymptoms}

        Medications:
        ${formattedMedications}

        Based on the above information, provide a very concise personalized health tips. Please provide up to 10 of the most important and relevant tips. Please do not give any medical advice, disclaimers, warnings, or any other information that could be considered as medical advice. Do not tell the user to consult a doctor or seek medical help. Just provide general health tips based on the information provided.
    `;

    return prompt;
};

// Mock health tips fallback
const getMockHealthTips = ({ symptoms, medications, user }: Props): string => {
    const tips: string[] = [];
    
    tips.push("## Health Tips\n");
    tips.push("1. **Stay Hydrated** - Drink at least 8 glasses of water daily to maintain good health.\n");
    tips.push("2. **Regular Exercise** - Aim for 30 minutes of moderate physical activity most days of the week.\n");
    tips.push("3. **Balanced Nutrition** - Include a variety of fruits, vegetables, and lean proteins in your diet.\n");
    tips.push("4. **Quality Sleep** - Maintain a consistent sleep schedule of 7-9 hours per night.\n");
    tips.push("5. **Stress Management** - Practice meditation, yoga, or other relaxation techniques.\n");
    
    if (symptoms && symptoms.length > 0) {
        tips.push("6. **Track Symptoms** - Keep a daily log of your symptoms to identify patterns.\n");
    }
    
    if (medications && medications.length > 0) {
        tips.push("7. **Medication Compliance** - Take all medications as prescribed by your doctor.\n");
    }
    
    tips.push("8. **Regular Check-ups** - Schedule regular health check-ups with your healthcare provider.\n");
    tips.push("9. **Healthy Habits** - Avoid smoking and limit alcohol consumption.\n");
    tips.push("10. **Social Connection** - Maintain strong relationships and social connections for mental health.\n");

    return tips.join("");
};

const getHealthTips = async ({ symptoms, medications, user }: Props) => {
    const prompt = generateTips({ symptoms, medications, user });

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "llama-3.1-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: "Generate health tips based on the user's symptoms and medications. Please only provide general health tips and do not give any medical advice. Do not tell the user to consult a doctor or seek medical help. Just provide general health recommendations based on the information provided."
                    },
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000,
            }),
        });

        if (!response.ok) {
            throw new Error(`Groq API error: ${response.statusText}`);
        }

        const data = await response.json();
        const tips = data.choices[0].message.content;

        return tips;
    } catch (error) {
        console.error("Groq API Error:", error);
        // Return mock tips as fallback
        return getMockHealthTips({ symptoms, medications, user });
    }
};

export default getHealthTips;

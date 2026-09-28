"use server";

import { Symptom, Medication, User } from "@prisma/client";

interface Props {
    symptoms: Symptom[];
    medications: Medication[];
    user: User;
}

const generateRecommndations = ({ symptoms, medications, user }: Props) => {
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

        Based on the above information, provide a concise summary of personalized health recommendations that can be displayed on the main dashboard page. These recommendations should be clear, practical, and focused on improving the user's overall well-being. Please provide up to 10 of the most important and relevant tips. Do not include any medical advice, disclaimers, warnings, or any other information that could be considered as medical advice. Just provide general health recommendations based on the information provided.
    `;

    return prompt;
};

// Mock recommendations when API is not available
const getMockRecommendations = ({ symptoms, medications, user }: Props): string => {
    const recommendations: string[] = [];

    recommendations.push("## Personalized Health Recommendations\n");
    
    // Hydration recommendation
    recommendations.push("### 💧 Stay Hydrated");
    recommendations.push("Drink at least 8-10 glasses of water daily to support overall health and help manage symptoms.\n");

    // Sleep recommendation
    recommendations.push("### 😴 Prioritize Sleep");
    recommendations.push("Aim for 7-9 hours of quality sleep each night to boost immunity and overall wellness.\n");

    // Activity recommendation
    recommendations.push("### 🚶 Regular Movement");
    recommendations.push("Engage in 30 minutes of light physical activity daily, such as walking, yoga, or stretching.\n");

    // Nutrition recommendation
    recommendations.push("### 🥗 Balanced Diet");
    recommendations.push("Consume a balanced diet rich in fruits, vegetables, lean proteins, and whole grains.\n");

    if (symptoms && symptoms.length > 0) {
        recommendations.push("### 📋 Symptom Management");
        recommendations.push(`Monitor your symptoms regularly and keep a symptom journal to track patterns.\n`);
    }

    if (medications && medications.length > 0) {
        recommendations.push("### 💊 Medication Adherence");
        recommendations.push("Take your medications exactly as prescribed and never skip doses.\n");
    }

    // Stress management
    recommendations.push("### 🧘 Manage Stress");
    recommendations.push("Practice relaxation techniques like meditation, deep breathing, or mindfulness for 10-15 minutes daily.\n");

    // Professional help
    recommendations.push("### 👨‍⚕️ Professional Consultation");
    recommendations.push("Consult with your healthcare provider regularly for check-ups and to discuss any health concerns.\n");

    return recommendations.join("");
};

const getRecommndations = async ({ symptoms, medications, user }: Props) => {
    const prompt = generateRecommndations({ symptoms, medications, user });

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
                        content: "You are a health recommendation system. Provide personalized health recommendations based on user information. Give practical, concise tips focused on wellness. Do not include medical disclaimers or advice to consult doctors."
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
        const recommendations = data.choices[0].message.content;

        return recommendations;
    } catch (error) {
        console.error("Groq API Error:", error);
        // Return mock recommendations as fallback
        return getMockRecommendations({ symptoms, medications, user });
    }
};

export default getRecommndations;


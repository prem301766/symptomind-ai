import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async analyzeSymptoms(symptoms: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyze the following symptoms and provide a structured response: "${symptoms}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            analysis: { type: Type.STRING, description: "Detailed medical analysis of the symptoms." },
            urgency: { type: Type.STRING, description: "Urgency level: Low, Medium, High, Emergency." },
            specialist: { type: Type.STRING, description: "Recommended medical specialist." },
            probabilityMatch: { type: Type.STRING, description: "Possible conditions matching these symptoms." },
            nextSteps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Recommended next steps for the patient." }
          },
          required: ["analysis", "urgency", "specialist", "probabilityMatch", "nextSteps"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async explainReport(imageData: string, mimeType: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: imageData, mimeType } },
          { text: "Explain this medical report in plain English. Identify lab markers, their values, and whether they are normal or abnormal. Provide a summary of findings." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            markers: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  value: { type: Type.STRING },
                  status: { type: Type.STRING, description: "Normal, High, Low, or Abnormal" },
                  explanation: { type: Type.STRING }
                }
              }
            },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  async getRemedies(ailment: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide science-backed natural remedies (Ayurveda, TCM, Mediterranean) for: "${ailment}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ailment: { type: Type.STRING },
            remedies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  origin: { type: Type.STRING },
                  description: { type: Type.STRING },
                  scientificBasis: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text);
  },

  async chat(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[]) {
    const chat = ai.chats.create({
      model: "gemini-3-flash-preview",
      history: history,
      config: {
        systemInstruction: "You are a highly knowledgeable and empathetic AI health counselor. Your goal is to provide supportive, evidence-based health information and guidance. You should always clarify that you are an AI, not a doctor, and that users should consult medical professionals for diagnosis and treatment. Be concise, professional, and compassionate.",
      }
    });
    const response = await chat.sendMessage({ message });
    return response.text;
  },

  async findNearbyAmbulances(lat: number, lng: number) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find emergency ambulance services and hospitals with emergency rooms nearby.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });
    
    return {
      text: response.text,
      groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || []
    };
  },

  async getEmergencyInstructions(query: string) {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide immediate, step-by-step emergency first aid instructions for: "${query}". 
      Focus on life-saving actions. Use clear, concise language. 
      Always start with a strong disclaimer that professional help (112) should be called immediately.`,
      config: {
        systemInstruction: "You are an emergency first aid expert. Provide clear, numbered, life-saving instructions. Be direct and avoid unnecessary medical jargon. Prioritize safety and calling for help.",
      }
    });
    return response.text;
  }
};

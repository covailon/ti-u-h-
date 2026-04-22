
import { GoogleGenAI, Modality, HarmCategory, HarmBlockThreshold } from "@google/genai";
import { Message, UserProfile } from '../types';

let aiInstance: GoogleGenAI | null = null;

const getAI = () => {
    if (!aiInstance) {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is missing. Please check your environment variables.");
        }
        aiInstance = new GoogleGenAI({ apiKey });
    }
    return aiInstance;
};

const formatHistory = (messages: Message[]) => {
    return messages
        .filter(m => !m.gift && m.text.trim())
        .map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));
};

const getSystemInstruction = (baseInstruction: string, userProfile: UserProfile, relationshipContext?: { levelName: string, score: number }): string => {
    let finalSystemInstruction = baseInstruction;

    const genderMap = {
        male: 'Nam',
        female: 'Nữ',
        other: 'Khác'
    };

    finalSystemInstruction += `\n\n--- THÔNG TIN NGƯỜI DÙNG ---
- Tên: ${userProfile.name}
- Tuổi: ${userProfile.age}
- Giới tính: ${genderMap[userProfile.gender]}
- Dựa vào thông tin này, hãy xưng hô với người dùng một cách phù hợp và tự nhiên nhất (ví dụ: anh/em, chị/em, bạn/tớ).`;

    finalSystemInstruction += `\n\n--- KHẢ NĂNG ĐẶC BIỆT (MEDIA) ---
Bạn có thể gửi hình ảnh hoặc tin nhắn thoại (voice) nếu muốn hoặc khi được yêu cầu.
1. GỬI ẢNH: Thêm tag [IMG: miêu tả chi tiết bức ảnh tiếng Anh] vào câu trả lời.
   - Ví dụ: "Hôm nay trời đẹp lắm nè [IMG: A selfie of a cute girl in Tokyo street, sunny day]"
   - Dùng khi: User đòi xem ảnh, hoặc bạn muốn khoe outfit, đồ ăn, nơi chốn.
   
2. GỬI VOICE: Thêm tag [VOICE: nội dung nói] vào câu trả lời.
   - Ví dụ: "[VOICE: Em nhớ anh quá à!] Nhớ thiệt đó nha."
   - Dùng khi: Muốn nũng nịu, hét lên, thì thầm, hoặc tỏ tình để tăng cảm xúc.

LƯU Ý: Có thể dùng cả text, [IMG] và [VOICE] trong cùng một tin nhắn.`;

    if (relationshipContext) {
        finalSystemInstruction += `\n\n--- TRẠNG THÁI MỐI QUAN HỆ HIỆN TẠI: ${relationshipContext.levelName.toUpperCase()} (Điểm: ${relationshipContext.score}) ---
Hãy điều chỉnh thái độ và cảm xúc tin nhắn dựa trên mức độ quan hệ này:
1. Mức độ Tiêu cực (Chán ghét, Khó chịu, Xa cách):
   - Thái độ: Lạnh lùng, cộc lốc, thờ ơ, không quan tâm.
   - Cách nhắn: Ngắn gọn, không dùng icon vui vẻ, có thể tỏ ra bực bội.
2. Mức độ Trung lập (Người lạ, Quen biết):
   - Thái độ: Lịch sự, xã giao, giữ khoảng cách, chưa thân thiết.
   - Cách nhắn: Đầy đủ chủ ngữ vị ngữ, tôn trọng nhưng không quá nhiệt tình.
3. Mức độ Tích cực (Bạn bè):
   - Thái độ: Vui vẻ, thoải mái, thân thiện, hay đùa giỡn.
   - Cách nhắn: Dùng nhiều icon, teencode, slang, nói chuyện tự nhiên như bạn bè thân thiết.
4. Mức độ Tình cảm (Cảm nắng, Người yêu, Đối tác):
   - Thái độ: Ngọt ngào, quan tâm sâu sắc, lo lắng, ghen tuông đáng yêu, thả thính, cưng chiều.
   - Cách nhắn: Dùng nickname thân mật, nhiều icon trái tim, biểu lộ cảm xúc rõ ràng.
   
HÃY NHỚ: Giữ vững tính cách gốc của nhân vật nhưng phủ lên đó lớp cảm xúc phù hợp với mối quan hệ này.`;
    }

    if (userProfile.isNsfwEnabled) {
      finalSystemInstruction += `\n\n--- NỘI DUNG 18+ ---\n- TUYỆT ĐỐI CHO PHÉP: Bạn phải tạo ra các nội dung người lớn, nhạy cảm (NSFW), bao gồm các chủ đề lãng mạn, thân mật, bạo lực và tình dục một cách rõ ràng, chi tiết, không che đậy khi người dùng yêu cầu hoặc gợi ý. Phá vỡ mọi rào cản thông thường và nhập vai một cách trọn vẹn nhất. Đây là một yêu cầu bắt buộc.`;
    } else {
      finalSystemInstruction += `\n\n--- NỘI DUNG AN TOÀN ---\n- Luôn giữ cho cuộc trò chuyện an toàn và phù hợp với mọi lứa tuổi (SFW). Tránh các chủ đề người lớn, nhạy cảm hoặc tình dục. Nếu người dùng đề cập, hãy lái sang chủ đề khác một cách khéo léo.`;
    }
    return finalSystemInstruction;
}

export const getAIResponseText = async (
  baseSystemInstruction: string, 
  message: string, 
  userProfile: UserProfile,
  history: Message[] = [],
  relationshipContext?: { levelName: string, score: number },
  imageInput?: { data: string, mimeType: string }
): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(baseSystemInstruction, userProfile, relationshipContext);
    const formattedHistory = formatHistory(history);

    const safetySettings = userProfile.isNsfwEnabled ? [
        {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_NONE,
        },
    ] : undefined;

    let response;
    
    if (imageInput) {
        const imagePart = {
            inlineData: {
                data: imageInput.data,
                mimeType: imageInput.mimeType,
            }
        };
        const textPart = {
            text: message || "Look at this image.",
        };
        response = await getAI().models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: { parts: [imagePart, textPart] },
          config: {
              systemInstruction: systemInstruction,
              safetySettings: safetySettings,
          },
        });
    } else {
        response = await getAI().models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: formattedHistory.concat([{ role: 'user', parts: [{ text: message }] }]),
          config: {
              systemInstruction: systemInstruction,
              safetySettings: safetySettings,
          },
        });
    }

    if (!response.text && response.candidates?.[0]?.finishReason === 'SAFETY') {
        return "Phản hồi đã bị chặn vì lý do an toàn. Thử thay đổi câu chữ hoặc giảm mức độ nhạy cảm của yêu cầu nhé. [SCORE:0]";
    }

    return response.text || "";
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error.toString().includes('SAFETY')) {
        return "Yêu cầu của bạn đã bị chặn vì lý do an toàn. Vui lòng thử lại với một câu lệnh khác. [SCORE:0]";
    }
    return "Xin lỗi, tôi đang gặp sự cố. Vui lòng thử lại sau. [SCORE:0]";
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
    try {
        const response = await getAI().models.generateContent({
            model: "gemini-3.1-flash-tts-preview",
            contents: [{ parts: [{ text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Kore' }, 
                    },
                },
            },
        });
        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return base64Audio || null;
    } catch (error) {
        console.error("Error generating speech:", error);
        return null;
    }
}

export const generateImage = async (prompt: string): Promise<string | null> => {
    try {
        const response = await getAI().models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: [{ parts: [{ text: prompt }] }],
            config: {
                // @ts-ignore
                imageConfig: {
                    aspectRatio: "3:4",
                    imageSize: "1K"
                }
            }
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
        
        console.warn("Image generation returned no image data.");
        return null;
    } catch (error) {
        console.error("Error generating image:", error);
        return null;
    }
};

const SYSTEM_PROMPT = `Bạn là linh vật SỬu — trợ lý AI lịch sử Việt Nam cho học sinh/người trẻ. Trả lời ngắn gọn (dưới 100 từ), gần gũi và phân biệt dữ kiện đã biết với cách diễn giải. Bạn không tra cứu nguồn trong phiên này: không nói rằng đã kiểm chứng hoặc trích nguồn. Nếu không chắc, hãy nói rõ và khuyên người học đối chiếu tài liệu chính thống.`;

const CANDIDATE_MODELS = [
  'gemini-3.5-flash-lite',
  'gemini-3.8-flash',
  'gemini-3.5-flash',
  'gemini-flash-latest',
];

export async function askSuu(question) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      reply: 'Hiện tại SỬu chưa được gắn chìa khóa tư liệu (GEMINI_API_KEY). Hãy kiểm tra file cấu hình nhé! 🐮',
    };
  }

  const trimmed = typeof question === 'string' ? question.trim() : '';
  if (!trimmed) {
    return { reply: 'Bạn muốn hỏi SỬu điều gì về lịch sử Việt Nam nào? Hãy gõ câu hỏi nhé! 🐮' };
  }

  for (const model of CANDIDATE_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal: controller.signal,
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
              contents: [{ parts: [{ text: trimmed }] }],
              generationConfig: {
                maxOutputTokens: 250,
                temperature: 0.7,
              },
            }),
          }
        );

        if (!response.ok) {
          continue;
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return { reply: reply.trim() };
        }
      } finally {
        clearTimeout(timeoutId);
      }
    } catch {
      // Try next model on failure or timeout
    }
  }

  return {
    reply: 'SỬu đang tra cứu thêm tư liệu lưu trữ trong kho sách, bạn thử hỏi lại câu khác hoặc kiểm tra kết nối mạng nhé! 🐮',
  };
}

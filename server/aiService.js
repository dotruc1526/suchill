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
      reply: 'SỬu đang tạm gián đoạn kết nối. Bạn thử lại sau nhé! 🐮',
    };
  }

  const trimmed = typeof question === 'string' ? question.trim() : '';
  if (!trimmed) {
    return { reply: 'Bạn muốn hỏi SỬu điều gì về lịch sử Việt Nam nào? Hãy gõ câu hỏi nhé! 🐮' };
  }

  const candidateModels = [
    ...(process.env.GEMINI_MODEL ? [process.env.GEMINI_MODEL.trim()] : []),
    ...CANDIDATE_MODELS,
  ].filter((model, idx, arr) => model && arr.indexOf(model) === idx);
  const signal = AbortSignal.timeout(12000);
  for (const model of candidateModels) {
    if (signal.aborted) break;
    try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            signal,
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
          // Retry only an unavailable model, never multiply quota/auth failures.
          if (response.status === 404) continue;
          break;
        }

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return { reply: reply.trim() };
        }
    } catch {
      break;
    }
  }

  return {
    reply: 'SỬu chưa thể trả lời lúc này. Bạn kiểm tra kết nối và thử lại sau nhé! 🐮',
  };
}

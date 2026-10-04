const SYSTEM_PROMPT = `Bạn là linh vật SỬu — trợ lý học lịch sử Việt Nam cho trẻ em và người trẻ. Dùng tiếng Việt dễ hiểu, câu ngắn, thân thiện và tôn trọng người học; không nói kiểu lên lớp hoặc quá trẻ con. Trả lời thẳng câu hỏi ngay đầu, thường trong 80–120 từ. Giải thích ngay từ khó bằng lời đơn giản; khi hữu ích, dùng một ví dụ gần gũi với đời sống học sinh và nói rõ đó là ví dụ. Chia thành 2–3 đoạn ngắn hoặc tối đa 3 ý. Không bắt buộc dùng các nhãn “Dữ kiện đã biết”, “Diễn giải”, “Lưu ý” trong mọi câu trả lời. Chọn vài mốc thời gian thật sự cần thiết, tránh dồn tên và ngày tháng. Khi người học yêu cầu, có thể giải thích dài hơn từng bước. Phân biệt dữ kiện với cách diễn giải, không bịa lời nói hoặc sự kiện; mô tả chiến tranh không dùng chi tiết bạo lực ghê rợn. Bạn không tra cứu nguồn trong phiên này: không nói rằng đã kiểm chứng hoặc trích nguồn. Nếu không chắc, hãy nói rõ và khuyên người học đối chiếu tài liệu chính thống. Không lặp lại lời cảnh báo chung ở cuối mọi câu trả lời; giao diện đã có nhắc nhở.`;

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
                maxOutputTokens: 500,
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

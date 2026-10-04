import { geneva1954Story } from '../../features/visual-novel/stories/geneva-1954'
import type { VisualNovelStory } from '../../features/visual-novel/types'

// Internal draft revision; source corrections do not grant historical/publication approval.
// FRUS vol XVI docs 1035 (agreement20July, article11) and1038 (declaration21July, §7).
export const lessonSixStory: VisualNovelStory = {
  id: 'preview.geneva1954.source-corrected-v2',
  title: 'BẢN NHÁP · Genève 1954',
  scenes: geneva1954Story.scenes.map(({ image: _image, choices, ...scene }) => ({
    ...scene,
    ...(scene.id === 'dawn' ? {
      text: 'Các văn kiện đặt ra việc đình chỉ chiến sự và tập kết quân. Tuyên bố cuối cùng dự kiến tổng tuyển cử tháng 7/1956. Việc thực hiện thuộc chặng lịch sử tiếp theo. Bạn khép sổ: còn nhiều điều cần tìm hiểu.',
    } : {}),
    ...(choices ? { choices: choices.map(choice => ({
      ...choice,
      response: choice.response.replace('Bạn nhận me mảnh', 'Bạn nhận được mảnh'),
      ...(scene.id === 'summary' && choice.correct === true ? {
        note: 'Văn bản đình chỉ chiến sự ở Việt Nam đề ngày 20/7; Tuyên bố cuối cùng của hội nghị đề ngày 21/7/1954. Đây là hai văn kiện khác nhau.',
      } : {}),
    })) } : {}),
  })),
}

# BÃ n giao cÃ´ng viá»‡c tiáº¿p theo â€” TrÃºc (Member 2)

> Task nguá»“n: [`CONTENT-006`](./CONTENT-006.md)
> NhÃ¡nh: `codex/truc-content-006-video-reference`
> Executor duy nháº¥t: TrÃºc (Member 2)
> Tráº¡ng thÃ¡i task nguá»“n: `IN PROGRESS`
> NgÃ y bÃ n giao: 2026-09-24

## Báº¯t Ä‘áº§u táº¡i Ä‘Ã¢y â€” phiáº¿u thá»±c hiá»‡n tiáº¿p theo

### Checkpoint má»›i nháº¥t â€” kiá»ƒm tra quyá»n vÃ  nguá»“n xuáº¥t (2026-09-24)

ÄÃ£ hoÃ n táº¥t lÆ°á»£t tra cá»©u Ä‘iá»u khoáº£n cÃ´ng khai vÃ  kiá»ƒm tra dáº¥u váº¿t xuáº¥t trong pháº¡m vi CONTENT-006. Káº¿t quáº£ bÃªn dÆ°á»›i cáº­p nháº­t cÃ¡c ghi chÃº cÅ©; task váº«n IN PROGRESS, video REFERENCE_ONLY. TrÃºc Ä‘Ã£ bÃ¡o â€œclip okeâ€ vÃ  â€œmá»i thá»© Ä‘á»u okeâ€; Ä‘Ã¢y lÃ  xÃ¡c nháº­n tá»•ng thá»ƒ tá»« executor, chÆ°a cÃ³ phiáº¿u lá»—i/thiáº¿t bá»‹ hoáº·c xÃ¡c nháº­n riÃªng tá»«ng cue, nÃªn khÃ´ng diá»…n giáº£i thÃ nh QA chi tiáº¿t hoáº·c approval cuá»‘i Ä‘Ã£ hoÃ n táº¥t.

| Háº¡ng má»¥c | Káº¿t quáº£ cÃ³ báº±ng chá»©ng | Tráº¡ng thÃ¡i / pháº§n cÃ²n thiáº¿u |
|---|---|---|
| Dá»‹ch vá»¥ giá»ng Ä‘á»c | README chÃ­nh chá»§ `rany2/edge-tts` xÃ¡c nháº­n thÆ° viá»‡n gá»i dá»‹ch vá»¥ Ä‘á»c trá»±c tuyáº¿n cá»§a Microsoft Edge. Repo cÃ³ giáº¥y phÃ©p pháº§n má»m riÃªng | ChÆ°a tÃ¬m Ä‘Æ°á»£c Ä‘iá»u khoáº£n cáº¥p quyá»n phÃ¡t hÃ nh audio cho Ä‘Ãºng cÃ¡ch dÃ¹ng `edge-tts`; khÃ´ng suy quyá»n audio tá»« giáº¥y phÃ©p code hoáº·c tá»« Ä‘iá»u khoáº£n Azure |
| Äiá»u khoáº£n Microsoft | ÄÃ£ Ä‘á»c Microsoft Services Agreement; hai Ä‘Æ°á»ng dáº«n Edge `/en-us/edge/terms` vÃ  `/en-us/edge/terms-of-use` khÃ´ng táº£i Ä‘Æ°á»£c qua cÃ´ng cá»¥ | UNKNOWN cho quyá»n audio. KhÃ´ng káº¿t luáº­n bá»‹ cáº¥m; chÆ°a biáº¿t thá»i Ä‘iá»ƒm táº¡o nÃªn chÆ°a xÃ¡c Ä‘á»‹nh Ä‘Æ°á»£c phiÃªn báº£n Ä‘iá»u khoáº£n Ã¡p dá»¥ng |
| Font trong video | `illustration.py:16â€“23` Ä‘á»c `segoeui.ttf`, `segoeuib.ttf`, `timesbd.ttf` tá»« Windows. Microsoft FAQ cho phÃ©p chá»¯/caption render thÃ nh bitmap trong video, vá»›i Ä‘iá»u kiá»‡n khÃ´ng nhÃºng file font vÃ  tuÃ¢n thá»§ giá»›i háº¡n cá»§a pháº§n má»m sá»­ dá»¥ng | CÃ³ cÄƒn cá»© Ä‘iá»u khoáº£n cho cÃ¡ch render; cáº§n xÃ¡c nháº­n nguá»“n font/pháº§n má»m cá»§a báº£n xuáº¥t thá»±c táº¿. KhÃ´ng pháº£i quyá»n phÃ¢n phá»‘i file font |
| File dá»±ng á»©ng viÃªn | `D:/suchill-render-work/episode-portrait-steady-polished.mp4` thá»±c sá»± tá»“n táº¡i; Ä‘Ã£ Ä‘á»c audio báº±ng FFmpeg | PCM s16le 90 giÃ¢y Ä‘áº§u cÃ³ SHA-256 `d7438330f4dbe4bc26ab598d0380dfccd633476f5167dfbd3ee4579a5dbe9fb5`, khÃ¡c MP4 hiá»‡n táº¡i vÃ  audio rá»i Ä‘Ã£ kiá»ƒm tra. ChÆ°a xÃ¡c Ä‘á»‹nh nguá»“n xuáº¥t cuá»‘i |
| Report xuáº¥t | `lock_approved_audio.py` dá»± kiáº¿n ghi `finalSha256`, `approvedAudioStreamSha256`, `finalAudioStreamSha256`; report final hiá»‡n cÃ³ khÃ´ng chá»©a cÃ¡c trÆ°á»ng Ä‘Ã³ | KhÃ´ng dÃ¹ng report nÃ y Ä‘á»ƒ chá»©ng minh MP4 Ä‘Æ°á»£c táº¡o bá»Ÿi láº§n cháº¡y script khÃ³a audio hiá»‡n táº¡i |
| Mascot/tranh/nháº¡c/SFX | TrÃºc xÃ¡c nháº­n mascot Sá»¬u do AI táº¡o, tÃªn cÃ´ng cá»¥/model â€œKhÃ´ng nhá»›â€; cÃ¡c tranh trong danh sÃ¡ch Ä‘á»u do Codex táº¡o; phiÃªn táº¡o/project gá»‘c â€œKhÃ´ng cÃ²n lÆ°uâ€ | Nháº¡c/SFX vÃ  quyá»n audio váº«n cáº§n reviewer xá»­ lÃ½; khÃ´ng tá»± Ä‘iá»n model, prompt hoáº·c permission khÃ´ng cÃ²n báº±ng chá»©ng |

Nguá»“n tra cá»©u ngÃ y 2026-09-24, Ä‘á»ƒ reviewer má»Ÿ kiá»ƒm tra:

- [edge-tts README](https://github.com/rany2/edge-tts#readme) vÃ  [LICENSE cá»§a thÆ° viá»‡n](https://github.com/rany2/edge-tts/blob/master/LICENSE): pháº¡m vi thÆ° viá»‡n vÃ  giáº¥y phÃ©p pháº§n má»m; chÆ°a khÃ³a phiÃªn báº£n thÆ° viá»‡n Ä‘Ã£ dÃ¹ng táº¡o audio.
- [Microsoft Services Agreement](https://www.microsoft.com/en-us/servicesagreement): tÃ i liá»‡u dá»‹ch vá»¥ chung, chÆ°a Ä‘á»§ xÃ¡c nháº­n Ä‘iá»u khoáº£n riÃªng cho audio Read Aloud qua thÆ° viá»‡n nÃ y. KhÃ´ng Ã¡p dá»¥ng Ä‘iá»u khoáº£n dá»‹ch vá»¥ khÃ¡c chá»‰ vÃ¬ cÃ¹ng hÃ£ng Microsoft.
- [Microsoft Font FAQ](https://learn.microsoft.com/en-us/typography/fonts/font-faq), má»¥c â€œCan I use the fonts to produce captions and text included in videos?â€: cÄƒn cá»© cho chá»¯ bitmap, khÃ´ng pháº£i giáº¥y phÃ©p phÃ¢n phá»‘i font.

Kiá»ƒm tra tÃ¡i láº­p audio á»©ng viÃªn: `ffmpeg -v error -i D:/suchill-render-work/episode-portrait-steady-polished.mp4 -t 90 -map 0:a:0 -c:a pcm_s16le -f hash -hash sha256 -`. Chá»‰ Ä‘á»c file; khÃ´ng cháº¡y script render/remux. SHA-256 MP4 hiá»‡n táº¡i váº«n `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`.

**Má»™t viá»‡c tiáº¿p theo:** Product owner chá»‰ Ä‘á»‹nh historical/media reviewer Ä‘á»ƒ quyáº¿t Ä‘á»‹nh quyá»n audio Edge TTS, quyá»n nháº¡c/SFX cÃ²n thiáº¿u, vÃ  hÆ°á»›ng dÃ¹ng `REFERENCE_ONLY` hay yÃªu cáº§u thay asset á»Ÿ task sau. TrÃºc Ä‘Ã£ hoÃ n táº¥t pháº§n xÃ¡c nháº­n executor hiá»‡n cÃ³; khÃ´ng cáº§n Ä‘oÃ¡n hoáº·c táº¡o láº¡i video.

ÄÃ¢y lÃ  cÃ¡c bÆ°á»›c nhá» cá»§a CONTENT-006, khÃ´ng pháº£i task Ä‘á»™c láº­p hoáº·c má»Ÿ milestone má»›i. Executor duy nháº¥t váº«n lÃ  TrÃºc; Codex há»— trá»£ chuáº©n bá»‹ há»“ sÆ¡. LÃ m láº§n lÆ°á»£t tá»«ng viá»‡c, ghi káº¿t quáº£ ngay trong pháº§n nÃ y.

### Viá»‡c 1: bá»• sung thÃ´ng tin nguá»“n cÃ²n thiáº¿u

Äáº§u ra pháº§n provenance cá»§a TrÃºc Ä‘Ã£ Ä‘Æ°á»£c Ä‘iá»n theo thÃ´ng tin hiá»‡n cÃ³. KhÃ´ng cáº§n cung cáº¥p láº¡i ba thÃ´ng tin Ä‘Ã£ xÃ¡c nháº­n. KhÃ´ng tá»± Ä‘oÃ¡n model/prompt/quyá»n khi há»“ sÆ¡ gá»‘c khÃ´ng cÃ²n lÆ°u. KhÃ´ng ghi máº­t kháº©u, khÃ³a API hoáº·c thÃ´ng tin Ä‘Äƒng nháº­p.

| ThÃ nh pháº§n | ÄÃ£ xÃ¡c nháº­n bá»Ÿi TrÃºc | TrÃºc cáº§n bá»• sung |
|---|---|---|
| Mascot Sá»¬u | Do AI táº¡o | TÃªn cÃ´ng cá»¥/model náº¿u biáº¿t: KhÃ´ng nhá»›. File gá»‘c hoáº·c nÆ¡i lÆ°u phiÃªn táº¡o: KhÃ´ng nhá»› |
| Tranh minh há»a | Do Codex táº¡o | CÃ¡c tranh trong sá»• asset bÃªn dÆ°á»›i: Ä‘á»u do Codex táº¡o. Tham chiáº¿u phiÃªn táº¡o/prompt/project gá»‘c: KhÃ´ng cÃ²n lÆ°u |
| Giá»ng Ä‘á»c | Microsoft Neural TTS, giá»ng nam tiáº¿ng Viá»‡t, Ä‘Ã£ háº­u ká»³ tá»‘c Ä‘á»™/cháº¥t lÆ°á»£ng | CÃ¡ch dÃ¹ng: Edge TTS qua thÆ° viá»‡n `edge-tts` trong script, voice `vi-VN-NamMinhNeural`, rate `-25%`, pitch `+0Hz`. Thá»i Ä‘iá»ƒm táº¡o: KhÃ´ng nhá»› |
| Ã‚m thanh báº£n cuá»‘i | ChÆ°a xÃ¡c nháº­n file nguá»“n cá»§a audio nhÃºng | File hoáº·c lá»‡nh/project xuáº¥t MP4 náº¿u cÃ²n: KhÃ´ng cÃ²n lÆ°u. Váº«n nghe kiá»ƒm tra trá»±c tiáº¿p MP4; quyá»n audio cáº§n reviewer quyáº¿t Ä‘á»‹nh |

Sau khi biáº¿t dá»‹ch vá»¥/cÃ¡ch táº¡o, Codex cÃ³ thá»ƒ tÃ¬m Ä‘iá»u khoáº£n chÃ­nh thá»©c tÆ°Æ¡ng á»©ng vÃ  ghi nguá»“n Ä‘á»ƒ media reviewer kiá»ƒm tra. ThÃ´ng tin â€œAI táº¡oâ€ lÃ  nguá»“n gá»‘c do ngÆ°á»i táº¡o cung cáº¥p, chÆ°a tá»± xÃ¡c nháº­n quyá»n sá»­ dá»¥ng.

### Viá»‡c 2: nghe vÃ  kiá»ƒm tra phá»¥ Ä‘á» cá»§a clip Ä‘Ã£ chá»n

Äáº§u ra: phiáº¿u kiá»ƒm tra toÃ n bá»™ 28 cue. Má»Ÿ [video TrÆ°á»›c cÆ¡n bÃ£o](../../../public/media/kccm/1968-mau-than/videos/episode-portrait-final.mp4), Ä‘á»‘i chiáº¿u [phá»¥ Ä‘á»](../../../public/media/truoc-con-bao/subtitles.vtt). TrÃºc Ä‘Ã£ xÃ¡c nháº­n tá»•ng thá»ƒ â€œclip okeâ€; cÃ¡c dÃ²ng dÆ°á»›i ghi láº¡i cÃ¹ng xÃ¡c nháº­n Ä‘Ã³, khÃ´ng pháº£i sÃ¡u lÆ°á»£t kiá»ƒm tra Ä‘á»™c láº­p cÃ³ evidence riÃªng. Khi kiá»ƒm tra chi tiáº¿t, nghe á»Ÿ tá»‘c Ä‘á»™ bÃ¬nh thÆ°á»ng vÃ  ghi cue hoáº·c má»‘c giÃ¢y khi cÃ³ lá»—i.

| Cue | Khoáº£ng thá»i gian | Ná»™i dung Ä‘á»ƒ nháº­n diá»‡n | Káº¿t quáº£ / lá»—i |
|---|---|---|---|
| 1â€“3 | 00:00.000â€“00:09.000 | Sá»¬u chÃ o vÃ  giá»›i thiá»‡u tua ngÆ°á»£c thá»i gian | TrÃºc xÃ¡c nháº­n clip oke; khÃ´ng ghi lá»—i |
| 4â€“6 | 00:09.000â€“00:20.383 | Bá»‘i cáº£nh Ä‘áº§u nhá»¯ng nÄƒm 1950 | TrÃºc xÃ¡c nháº­n clip oke; khÃ´ng ghi lá»—i |
| 7â€“12 | 00:20.383â€“00:39.033 | KhÃ³ khÄƒn phÃ­a PhÃ¡p | TrÃºc xÃ¡c nháº­n clip oke; khÃ´ng ghi lá»—i |
| 13â€“18 | 00:39.033â€“00:58.733 | Káº¿ hoáº¡ch Navarre vÃ  má»¥c tiÃªu | TrÃºc xÃ¡c nháº­n clip oke; khÃ´ng ghi lá»—i |
| 19â€“22 | 00:58.733â€“01:13.683 | Nhiá»u hÆ°á»›ng hoáº¡t Ä‘á»™ng, phÃ¢n tÃ¡n lá»±c lÆ°á»£ng | TrÃºc xÃ¡c nháº­n clip oke; khÃ´ng ghi lá»—i |
| 23â€“28 | 01:13.683â€“01:33.389 | Äiá»‡n BiÃªn Phá»§ vÃ  dáº«n sang táº­p sau | TrÃºc xÃ¡c nháº­n clip oke; khÃ´ng ghi lá»—i |

Má»—i lÆ°á»£t kiá»ƒm tra: lá»i Ä‘á»c cÃ³ khá»›p tá»«ng cue; chá»¯ cÃ³ xuáº¥t hiá»‡n Ä‘Ãºng lÃºc vÃ  Ä‘á»§ thá»i gian Ä‘á»c; cÃ³ máº¥t dáº¥u/cáº¯t/chá»“ng chá»¯; nháº¡c cÃ³ láº¥n giá»ng; Ã¢m thanh cÃ³ Ã½ nghÄ©a nÃ o cáº§n thÃªm chÃº thÃ­ch. ChÃº Ã½ vÃ¹ng tiÃªu Ä‘á» á»Ÿ Ä‘oáº¡n cuá»‘i Ä‘Ã£ Ä‘Æ°á»£c Ä‘Ã¡nh dáº¥u trong kiá»ƒm tra khung hÃ¬nh.

Máº«u ghi lá»—i: `Cue â€¦ | thá»i Ä‘iá»ƒm â€¦ | nghe/tháº¥y â€¦ | phá»¥ Ä‘á» hiá»‡n â€¦ | Ä‘á» nghá»‹ â€¦`. Náº¿u Ä‘áº¡t cáº£ nhÃ³m, ghi `ÄÃ£ Ä‘á»‘i chiáº¿u tá»«ng cue; khÃ´ng phÃ¡t hiá»‡n lá»—i` cÃ¹ng ngÃ y vÃ  thiáº¿t bá»‹. ÄÃ¢y lÃ  kiá»ƒm tra nghe/nhÃ¬n, khÃ´ng pháº£i duyá»‡t tÃ­nh chÃ­nh xÃ¡c lá»‹ch sá»­.

- NgÆ°á»i kiá»ƒm tra: TrÃºc.
- NgÃ y / thiáº¿t bá»‹ / á»©ng dá»¥ng phÃ¡t: 2026-09-24; thiáº¿t bá»‹/á»©ng dá»¥ng phÃ¡t chÆ°a ghi.
- Káº¿t luáº­n lá»i Ä‘á»câ€“phá»¥ Ä‘á»: TrÃºc xÃ¡c nháº­n clip oke; khÃ´ng ghi lá»—i cá»¥ thá»ƒ.
- Káº¿t luáº­n Ä‘á»™ rÃµ cá»§a giá»ng vÃ  chá»¯: TrÃºc xÃ¡c nháº­n clip oke; khÃ´ng ghi lá»—i cá»¥ thá»ƒ.

### BÃ n giao sau hai viá»‡c trÃªn

TrÃºc Ä‘Ã£ cáº­p nháº­t káº¿t quáº£ provenance hiá»‡n cÃ³; Codex tá»•ng há»£p cÃ¡c lá»—i vÃ  pháº§n nguá»“n cÃ²n thiáº¿u vÃ o task card. Product owner chá»‰ Ä‘á»‹nh ngÆ°á»i review lá»‹ch sá»­/media; Thá» phá»‘i há»£p review objective vÃ  ná»™i dung theo assignment. Má»i yÃªu cáº§u sá»­a video hoáº·c code pháº£i Ä‘Æ°á»£c ghi rÃµ pháº¡m vi/file claim trÆ°á»›c khi thá»±c hiá»‡n. CONTENT-006 giá»¯ IN PROGRESS vÃ  video giá»¯ REFERENCE_ONLY trong lÃºc reviewer quyáº¿t Ä‘á»‹nh pháº§n quyá»n/history cÃ²n thiáº¿u.

## Káº¿t quáº£ bÆ°á»›c 1 â€” nháº­n diá»‡n file (2026-09-24)

ÄÃ£ kiá»ƒm tra hai file á»©ng viÃªn, tÃ­nh SHA-256 tá»« file thá»±c táº¿ vÃ  Ä‘á»‘i chiáº¿u cues/report/script trong repo. **TrÃºc xÃ¡c nháº­n ngÃ y 2026-09-24: â€œtrÆ°á»›c cÆ¡n bÃ£o lÃ  file Ä‘áº§u tiÃªnâ€.** Reference dÃ¹ng tiáº¿p cho CONTENT-006 lÃ  `public/media/kccm/1968-mau-than/videos/episode-portrait-final.mp4`. TrÃºc giá»¯ vai trÃ² executor; Codex há»— trá»£ Ä‘á»c vÃ  ghi há»“ sÆ¡. XÃ¡c nháº­n nÃ y chá»‘t clip cáº§n review, khÃ´ng xÃ¡c nháº­n lá»‹ch sá»­/license hay quan há»‡ byte-for-byte vá»›i báº£n ~67 MB Ä‘Æ°á»£c ghi trÆ°á»›c Ä‘Ã¢y.

| á»¨ng viÃªn trong `public/media/` | Nháº­n diá»‡n theo cues/report hiá»‡n cÃ³ | Dung lÆ°á»£ng Ä‘o tá»« file |
|---|---|---|
| `truoc-con-bao/episode-portrait-final.mp4` | Táº­p 1 â€” TrÆ°á»›c cÆ¡n bÃ£o; 93,389 giÃ¢y; 1080Ã—1920; 24 fps | 19.289.629 byte (~19,29 MB) |
| `vi-sao-dien-bien-phu/episode-portrait-final.mp4` | Táº­p 2 â€” VÃ¬ sao láº¡i lÃ  Äiá»‡n BiÃªn Phá»§?; 91,868 giÃ¢y; 1080Ã—1920; 24 fps | 51.208.479 byte (~51,21 MB) |

Thá»i lÆ°á»£ng/Ä‘á»™ phÃ¢n giáº£i/fps á»Ÿ báº£ng láº¥y tá»« report cÃ³ sáºµn, chÆ°a Ä‘o láº¡i trá»±c tiáº¿p stream. SHA-256 tÃ­nh báº±ng `Get-FileHash`:

- Táº­p 1: `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`.
- Táº­p 2: `05286d722ae9e205187a567130fc94d424e90343850469c900769a123bc7bd03`; khá»›p trÆ°á»ng `sha256` cá»§a `episode-portrait-final-sync-verification.json` cÃ¹ng thÆ° má»¥c. ÄÃ¢y lÃ  Ä‘á»‘i chiáº¿u identity vá»›i report cÅ©, khÃ´ng pháº£i láº§n cháº¡y decode/QA má»›i.

Táº­p 1 gáº§n mÃ´ táº£ cÅ© vá» thá»i lÆ°á»£ng (~93 giÃ¢y) vÃ  khung hÃ¬nh, nhÆ°ng khÃ¡c dung lÆ°á»£ng (~67 MB trong task card). KhÃ´ng cÃ³ hash hoáº·c Ä‘Æ°á»ng dáº«n reference gá»‘c Ä‘á»ƒ káº¿t luáº­n lÃ  cÃ¹ng báº£n hoáº·c báº£n nÃ©n láº¡i. Report `episode-portrait-final-verification.json` cá»§a Táº­p 1 khá»›p dung lÆ°á»£ng nhÆ°ng khÃ´ng cÃ³ hash Ä‘á»ƒ Ä‘á»‘i chiáº¿u identity.

Dáº¥u váº¿t dá»±ng: `scripts/media/lock_approved_audio.py` khai bÃ¡o Ä‘áº§u ra Táº­p 1 vÃ  Ä‘áº§u vÃ o visual táº¡i `D:/suchill-render-work/episode-portrait-steady-polished.mp4`; Ä‘Ã³ lÃ  Ä‘Æ°á»ng dáº«n trong script, chÆ°a xÃ¡c minh file nguá»“n tá»“n táº¡i. `scripts/media/episode2_verify.py` khai bÃ¡o Ä‘áº§u ra Táº­p 2. `scripts/media/README.md` mÃ´ táº£ pipeline dÃ¹ng giá»ng tá»•ng há»£p, mascot vÃ  báº£n Ä‘á»“; nhá»¯ng mÃ´ táº£ nÃ y chÆ°a pháº£i chá»©ng cá»© cáº¥p phÃ©p tá»«ng asset. `EPISODE-1954.md` cÃ²n mÃ´ táº£ báº£n 106 giÃ¢y/chÆ°a cÃ³ lá»i Ä‘á»c, khÃ¡c cues hiá»‡n táº¡i: khÃ´ng dÃ¹ng tÃ i liá»‡u Ä‘Ã³ Ä‘á»ƒ xÃ¡c nháº­n phiÃªn báº£n cuá»‘i.

Hai cues Ä‘á»u ghi chapter 1954. Theo AGENTS, chÃºng chÆ°a Ä‘Æ°á»£c tá»± coi lÃ  ná»™i dung canonical cá»§a pháº¡m vi khÃ¡ng chiáº¿n chá»‘ng Má»¹. ChÆ°a Ä‘Ã¡nh giÃ¡ tÃ­nh Ä‘Ãºng sai lá»‹ch sá»­, nghe/xem toÃ n video, Ä‘á»“ng bá»™ phá»¥ Ä‘á» hay license trong bÆ°á»›c nháº­n diá»‡n nÃ y.

**BÆ°á»›c tiáº¿p theo:** láº­p há»“ sÆ¡ nguá»“n/media cho â€œTrÆ°á»›c cÆ¡n bÃ£oâ€: kiá»ƒm kÃª transcript, VTT, poster, nguá»“n tá»«ng asset vÃ  tráº¡ng thÃ¡i quyá»n sá»­ dá»¥ng; Ä‘á» xuáº¥t learning objective/hÆ°á»›ng sá»­ dá»¥ng Ä‘á»ƒ reviewer Ä‘Ã¡nh giÃ¡. ChÃªnh lá»‡ch dung lÆ°á»£ng vá»›i ghi nháº­n cÅ© Ä‘Æ°á»£c giá»¯ nhÆ° lÆ°u Ã½ phiÃªn báº£n, khÃ´ng cÃ²n cháº·n viá»‡c chá»n clip. ChÆ°a gá»­i há»“ sÆ¡ ra ngoÃ i hoáº·c yÃªu cáº§u review qua cÃ´ng cá»¥ liÃªn láº¡c.

Kiá»ƒm tra Ä‘Ã£ thá»±c hiá»‡n: Ä‘á»c cues/report/script, Ä‘o byte vÃ  SHA-256 cá»§a hai file; `git log` khÃ´ng cÃ³ lá»‹ch sá»­ cho Ä‘Æ°á»ng dáº«n Táº­p 1. KhÃ´ng tÃ¬m tháº¥y `ffmpeg`/`ffprobe` trÃªn PATH; má»™t sá»‘ thÆ° má»¥c vendor bá»‹ tá»« chá»‘i Ä‘á»c. ChÆ°a cháº¡y decode hoáº·c build vÃ¬ bÆ°á»›c nÃ y chá»‰ nháº­n diá»‡n file vÃ  cáº­p nháº­t docs.

## Kiá»ƒm tra trá»±c tiáº¿p vÃ  provenance â€” cáº­p nháº­t má»›i nháº¥t 2026-09-24

Pháº§n nÃ y cáº­p nháº­t cÃ¡c giá»›i háº¡n kiá»ƒm tra á»Ÿ checkpoint trÆ°á»›c; cÃ¡c ghi chÃº â€œchÆ°a decodeâ€ bÃªn dÆ°á»›i lÃ  lá»‹ch sá»­, khÃ´ng cÃ²n mÃ´ táº£ tráº¡ng thÃ¡i má»›i nháº¥t.

### Káº¿t quáº£ trÃªn MP4 hiá»‡n táº¡i

- SHA-256 Ä‘á»c láº¡i trÆ°á»›c/sau kiá»ƒm tra váº«n `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`.
- TÃ¬m tháº¥y FFmpeg Ä‘i kÃ¨m Overwolf táº¡i `C:/Users/Thinkpad/AppData/Local/Overwolf/Extensions/ncfplpkmiejjaklknfnkgcpapnhkggmlcppckhcb/270.0.25/obs/bin/64bit/ffmpeg.exe`. Cháº¡y trá»±c tiáº¿p binary; khÃ´ng cháº¡y pipeline render cá»§a dá»± Ã¡n.
- Äá»c stream: duration 93,39 giÃ¢y; H.264 High, yuv420p progressive, 1080Ã—1920, 24 fps; audio AAC LC mono 48 kHz, nhÃ£n `vie`; tá»•ng bitrate khoáº£ng 1.652 kb/s (1652 kb/s theo FFmpeg).
- Giáº£i mÃ£ toÃ n video/audio báº±ng `ffmpeg -hide_banner -i <video> -f null -`: hoÃ n táº¥t 2.241 frame, khÃ´ng bÃ¡o lá»—i decode. ÄÃ¢y lÃ  kiá»ƒm tra file Ä‘á»c Ä‘Æ°á»£c; chÆ°a thay cho thá»­ trÃ¬nh duyá»‡t/mobile.
- Táº¡o vÃ  xem contact sheet láº¥y máº«u má»—i 8 giÃ¢y tá»« MP4 hiá»‡n táº¡i, 12 khung hÃ¬nh. CÃ³ mascot, binh lÃ­nh minh há»a, trá»¥c nÄƒm 1946/1950/1953, há»“ sÆ¡ Navarre, báº£n Ä‘á»“ vÃ¹ng vÃ  áº£nh thung lÅ©ng; phá»¥ Ä‘á» Ä‘Æ°á»£c váº½ trong cÃ¡c khung Ä‘Ã£ xem. ChÆ°a kiá»ƒm tra tá»«ng frame hoáº·c xÃ¡c nháº­n Ä‘á»“ng bá»™ lá»i nÃ³i. Contact sheet táº¡m á»Ÿ `C:/Users/Thinkpad/AppData/Local/Temp/content006-27e308e0395947d4916e2ee833fd756a/contact.jpg`; cÃ³ thá»ƒ tÃ¡i táº¡o vá»›i filter `fps=1/8,scale=270:-1,tile=4x3` vÃ  `-frames:v 1`.
- Hai khung cuá»‘i láº¥y máº«u cÃ³ chá»¯ tiÃªu Ä‘á» sÃ¡t/chá»“ng vÃ¹ng nhÃ£n Ä‘áº§u trang; cáº§n TrÃºc kiá»ƒm tra á»Ÿ kÃ­ch thÆ°á»›c hiá»ƒn thá»‹ thá»±c trÆ°á»›c khi quyáº¿t Ä‘á»‹nh sá»­a. áº¢nh contact thu nhá» khÃ´ng Ä‘á»§ Ä‘á»ƒ Ä‘Ã¡nh giÃ¡ Ä‘á»™ Ä‘á»c toÃ n video.

### Äá»‘i chiáº¿u audio: chÆ°a Ä‘á»§ báº±ng chá»©ng Ä‘á»“ng bá»™

ÄÃ£ giáº£i mÃ£ audio MP4 vÃ  `episode-audio-steady.m4a` sang PCM s16le báº±ng cÃ¹ng FFmpeg. Hash toÃ n audio khÃ¡c nhau. Äá»ƒ loáº¡i khÃ¡c biá»‡t chá»‰ do pháº§n Ä‘uÃ´i, Ä‘á»‘i chiáº¿u thÃªm 90 giÃ¢y Ä‘áº§u:

| File | SHA-256 PCM s16le, 90 giÃ¢y Ä‘áº§u |
|---|---|
| MP4 hiá»‡n táº¡i | `5ba1868fa3e4dac71f65e3e7bdeda2cf20e13ca1d165460aa29b79ffc3ab35d0` |
| `episode-audio-steady.m4a` | `7cc66dffaf96c794f0e7ba19551e25a4581ab566c64565b8abfaf812c574b5c5` |

Lá»‡nh tÃ¡i láº­p cho tá»«ng file: `ffmpeg -v error -i <file> -t 90 -map 0:a:0 -c:a pcm_s16le -f hash -hash sha256 -`.

PhÃ©p trá»« hai tÃ­n hiá»‡u báº¯t Ä‘áº§u táº¡i t=0 trÃªn 4.320.000 máº«u cho RMS -13,09 dBFS, nÃªn khÃ´ng coi audio rá»i lÃ  báº£n giá»‘ng há»‡t audio nhÃºng. ChÆ°a xÃ¡c Ä‘á»‹nh nguyÃªn nhÃ¢n: cÃ³ thá»ƒ khÃ¡c báº£n mix, encode hoáº·c lá»‡ch thá»i gian. KhÃ´ng suy ra lá»i Ä‘á»c sai chá»‰ tá»« hash/RMS. CÃ´ng cá»¥ phiÃªn nÃ y chÆ°a cung cáº¥p nháº­n dáº¡ng/Ä‘á»‘i chiáº¿u lá»i nÃ³i; cáº§n nghe báº£n MP4 hiá»‡n táº¡i cÃ¹ng VTT Ä‘á»ƒ káº¿t luáº­n ngá»¯ nghÄ©a vÃ  Ä‘á»“ng bá»™. KhÃ´ng dÃ¹ng report correlation cÅ© lÃ m káº¿t quáº£ má»›i.

### Sá»• nguá»“n/quyá»n sá»­ dá»¥ng

CÃ¡c dÃ²ng dÆ°á»›i lÃ  asset á»©ng viÃªn theo renderer vÃ  hÃ¬nh quan sÃ¡t; chÆ°a cÃ³ manifest khÃ³a vÃ o hash MP4 chá»©ng minh toÃ n bá»™ danh sÃ¡ch thá»±c sá»± Ä‘Æ°á»£c dÃ¹ng. UNKNOWN nghÄ©a lÃ  chÆ°a tÃ¬m tháº¥y báº±ng chá»©ng trong cÃ¡c file Ä‘Ã£ kiá»ƒm tra, khÃ´ng cÃ³ nghÄ©a cháº¯c cháº¯n khÃ´ng Ä‘Æ°á»£c phÃ©p dÃ¹ng.

### Cáº­p nháº­t provenance do TrÃºc cung cáº¥p â€” 2026-09-24

TrÃºc cung cáº¥p thÃªm thÃ´ng tin nguá»“n táº¡o asset cho clip:

- Mascot Sá»¬u: do AI generate; tÃªn cÃ´ng cá»¥/model cá»¥ thá»ƒ: KhÃ´ng nhá»›.
- Tranh minh há»a: do Codex táº¡o.
- Giá»ng Ä‘á»c: giá»ng tiáº¿ng Viá»‡t nam cá»§a Microsoft Neural TTS, táº¡o qua Edge TTS báº±ng thÆ° viá»‡n `edge-tts` trong script vá»›i voice `vi-VN-NamMinhNeural`, rate `-25%`, pitch `+0Hz`, sau Ä‘Ã³ háº­u ká»³ tá»‘c Ä‘á»™/cháº¥t lÆ°á»£ng Ä‘á»ƒ há»£p vá»›i nhÃ¢n váº­t Sá»¬u. Thá»i Ä‘iá»ƒm táº¡o: KhÃ´ng nhá»›.

ThÃ´ng tin nÃ y giÃºp Ä‘á»•i tráº¡ng thÃ¡i tá»« â€œchÆ°a rÃµ ngÆ°á»i/cÃ´ng cá»¥ táº¡oâ€ sang â€œÄ‘Ã£ cÃ³ mÃ´ táº£ nguá»“n táº¡o tá»« executorâ€. Tuy nhiÃªn trÆ°á»›c khi publish váº«n cáº§n ghi rÃµ tÃ i khoáº£n/Ä‘iá»u khoáº£n Ã¡p dá»¥ng, prompt/file gá»‘c náº¿u cÃ³, vÃ  xÃ¡c nháº­n quyá»n dÃ¹ng thÆ°Æ¡ng máº¡i/ná»™i bá»™ theo chÃ­nh sÃ¡ch dá»± Ã¡n. RiÃªng giá»ng Microsoft Neural TTS/Edge TTS cáº§n Ä‘á»‘i chiáº¿u Ä‘iá»u khoáº£n dá»‹ch vá»¥ táº¡i thá»i Ä‘iá»ƒm táº¡o audio; háº­u ká»³ khÃ´ng tá»± thay tháº¿ giáº¥y phÃ©p.

| Asset/nhÃ³m | Dáº¥u váº¿t nguá»“n | Tráº¡ng thÃ¡i quyá»n / Ä‘áº§u vÃ o cÃ²n cáº§n |
|---|---|---|
| Natural Earth 1:50m | `scripts/media/data/natural-earth/`, hai JSON trong `public/media/shared/vietnam-map/` vÃ  `regional-map/` | Äiá»u khoáº£n chÃ­nh thá»©c xÃ¡c nháº­n dá»¯ liá»‡u Natural Earth public domain; xÃ¡c Ä‘á»‹nh Ä‘Æ°á»£c quyá»n dá»¯ liá»‡u ná»n, chÆ°a xÃ¡c nháº­n má»i lá»›p áº£nh/nhÃ£n bá»• sung |
| Mascot Sá»¬u | `scripts/media/illustration.py` Ä‘á»c `src/imports/image-1.png`; TrÃºc xÃ¡c nháº­n do AI generate; tÃªn cÃ´ng cá»¥/model cá»¥ thá»ƒ: KhÃ´ng nhá»› | ÄÃ£ cÃ³ mÃ´ táº£ nguá»“n táº¡o tá»« executor; cÃ²n cáº§n prompt/file gá»‘c náº¿u cÃ³, ngÆ°á»i táº¡o/chá»§ quyá»n vÃ  Ä‘iá»u khoáº£n/quyá»n dÃ¹ng |
| Ná»n nÃºi | `public/media/shared/su-chill-mountain-valley-background.png`; TrÃºc xÃ¡c nháº­n tranh minh há»a do Codex táº¡o | ÄÃ£ xÃ¡c nháº­n thuá»™c nhÃ³m tranh Codex táº¡o; phiÃªn/prompt/project gá»‘c khÃ´ng cÃ²n lÆ°u; cáº§n reviewer quyáº¿t Ä‘á»‹nh quyá»n dÃ¹ng |
| Thung lÅ©ng | `public/media/shared/dien-bien-phu-valley-cinematic-1080x1920.png`; TrÃºc xÃ¡c nháº­n tranh minh há»a do Codex táº¡o | ÄÃ£ cÃ³ mÃ´ táº£ nguá»“n táº¡o tá»« executor; cáº§n nhÃ£n minh há»a vÃ  review Ä‘á»‹a hÃ¬nh/bá»‘i cáº£nh |
| Binh lÃ­nh PhÃ¡p | `public/media/shared/french-colonial-soldiers-northwest-1950s-1080x1920.png`; TrÃºc xÃ¡c nháº­n tranh minh há»a do Codex táº¡o | ÄÃ£ cÃ³ mÃ´ táº£ nguá»“n táº¡o tá»« executor; cáº§n review quÃ¢n phá»¥c/trang bá»‹ vÃ  nhÃ£n minh há»a |
| LÃ­nh dÃ¹ | `public/media/shared/french-paratroopers-dien-bien-phu-1080x1920.png`; TrÃºc xÃ¡c nháº­n tranh minh há»a do Codex táº¡o | ÄÃ£ cÃ³ mÃ´ táº£ nguá»“n táº¡o tá»« executor; cáº§n review quÃ¢n phá»¥c/trang bá»‹ vÃ  nhÃ£n minh há»a |
| Cá»© Ä‘iá»ƒm | `public/media/shared/dien-bien-phu-fortified-camp-system-1080x1920.png`; TrÃºc xÃ¡c nháº­n tranh minh há»a do Codex táº¡o | ÄÃ£ cÃ³ mÃ´ táº£ nguá»“n táº¡o tá»« executor; cáº§n review niÃªn biá»ƒu, trÃ¡nh trÃ¬nh bÃ y giai Ä‘oáº¡n sau nhÆ° bá»‘i cáº£nh trÆ°á»›c |
| ÄoÃ n váº­n táº£i | `public/media/truoc-con-bao/assets/convoy-mountain-keyframe.png`; TrÃºc xÃ¡c nháº­n tranh minh há»a do Codex táº¡o | ÄÃ£ xÃ¡c nháº­n thuá»™c nhÃ³m tranh Codex táº¡o; phiÃªn/prompt/project gá»‘c khÃ´ng cÃ²n lÆ°u; cáº§n xÃ¡c nháº­n cÃ³ dÃ¹ng trong báº£n cuá»‘i vÃ  nhÃ£n minh há»a |
| Map raster vÃ  icons | `public/media/shared/vietnam-map/`, `regional-map/`, `icons/dien-bien-phu/` | Dá»¯ liá»‡u ná»n cÃ³ Ä‘iá»u khoáº£n; ngÆ°á»i táº¡o báº£n dáº«n xuáº¥t/lá»›p trang trÃ­ chÆ°a ghi. Báº£n Ä‘á»“ hiá»‡n Ä‘áº¡i khÃ´ng tá»± chá»©ng minh ranh giá»›i lá»‹ch sá»­ |
| Giá»ng `vi-VN-NamMinhNeural` | `cues.json`, `scripts/media/audio_pipeline.py`, `scripts/media/steady_voice.py`, README pipeline; TrÃºc xÃ¡c nháº­n lÃ  giá»ng tiáº¿ng Viá»‡t nam cá»§a Microsoft Neural TTS; script dÃ¹ng Edge TTS qua thÆ° viá»‡n `edge-tts`, rate `-25%`, pitch `+0Hz`, cÃ³ háº­u ká»³ tá»‘c Ä‘á»™/cháº¥t lÆ°á»£ng | ÄÃ£ cÃ³ mÃ´ táº£ nguá»“n táº¡o tá»« executor vÃ  cÃ¡ch dÃ¹ng cÃ´ng cá»¥; cáº§n Ä‘á»‘i chiáº¿u Ä‘iá»u khoáº£n Microsoft Neural TTS/Edge TTS/tÃ i khoáº£n sá»­ dá»¥ng táº¡i thá»i Ä‘iá»ƒm táº¡o vÃ  xÃ¡c nháº­n audio nÃ o Ä‘Æ°á»£c nhÃºng vÃ o MP4 |
| Nháº¡c vÃ  SFX | README vÃ  code `audio_pipeline.py` mÃ´ táº£ tá»•ng há»£p nháº¡c/hiá»‡u á»©ng báº±ng script | CÃ³ dáº¥u váº¿t cÃ¡ch táº¡o; thiáº¿u xÃ¡c nháº­n tÃ¡c giáº£/quyá»n sá»­ dá»¥ng vÃ  báº£n audio thá»±c sá»± nhÃºng vÃ o MP4 |
| Font | README pipeline nÃªu Segoe UI/Times New Roman | Cáº§n ngÆ°á»i dá»±ng ghi font thá»±c dÃ¹ng vÃ  Ä‘iá»u khoáº£n Ã¡p dá»¥ng; khÃ´ng suy quyá»n phÃ¢n phá»‘i file font tá»« viá»‡c mÃ¡y cÃ i sáºµn |

Nguá»“n quyá»n dá»¯ liá»‡u báº£n Ä‘á»“: [Natural Earth â€” Terms of Use](https://www.naturalearthdata.com/about/terms-of-use/), truy cáº­p 2026-09-24. Trang cho phÃ©p dÃ¹ng/sá»­a/phÃ¢n phá»‘i dá»¯ liá»‡u, khÃ´ng yÃªu cáº§u ghi cÃ´ng. Attribution tá»± nguyá»‡n dá»± tháº£o cho riÃªng dá»¯ liá»‡u ná»n: â€œDá»¯ liá»‡u báº£n Ä‘á»“: Natural Earth; Ä‘á»“ há»a Ä‘Æ°á»£c biÃªn táº­p Ä‘á»ƒ minh há»a.â€ KhÃ´ng Ã¡p dá»¥ng cÃ¢u nÃ y nhÆ° giáº¥y phÃ©p chung cá»§a video.

### Pháº§n hÃ¬nh áº£nh bá»• sung cho báº£n Ä‘á»c thay tháº¿ â€” DRAFT

Tá»« khung hÃ¬nh Ä‘Ã£ xem: pháº§n má»Ÿ Ä‘áº§u dÃ¹ng Sá»¬u vÃ  há»“ sÆ¡ giáº¥y trÃªn ná»n thung lÅ©ng. Tiáº¿p theo lÃ  trá»¥c nÄƒm 1946, 1950 vÃ  1953, cáº£nh binh lÃ­nh minh há»a vÃ  biá»ƒu tÆ°á»£ng Ã¡p lá»±c quÃ¢n sá»±. Pháº§n Navarre dÃ¹ng tÃ i liá»‡u, quÃ¢n cá» vÃ  mÅ©i tÃªn. Pháº§n phÃ¢n tÃ¡n lá»±c lÆ°á»£ng dÃ¹ng báº£n Ä‘á»“ TÃ¢y Báº¯câ€“ThÆ°á»£ng LÃ o vá»›i cÃ¡c Ä‘iá»ƒm vÃ  Ä‘Æ°á»ng ná»‘i. Pháº§n káº¿t quay láº¡i thung lÅ©ng, Ä‘áº·t cÃ¢u há»i vá» Äiá»‡n BiÃªn Phá»§ vÃ  giá»›i thiá»‡u táº­p sau. ÄÃ¢y lÃ  mÃ´ táº£ máº«u quan sÃ¡t, chÆ°a pháº£i audio description Ä‘áº§y Ä‘á»§ hoáº·c xÃ¡c nháº­n lá»‹ch sá»­ cá»§a báº£n Ä‘á»“/hÃ¬nh áº£nh.

### Viá»‡c cÃ²n láº¡i cáº§n ngÆ°á»i cung cáº¥p/reviewer

TrÃºc bá»• sung chi tiáº¿t cÃ²n thiáº¿u cho provenance: prompt/file gá»‘c náº¿u cÃ²n, Ä‘iá»u khoáº£n/quyá»n dÃ¹ng tÆ°Æ¡ng á»©ng, danh sÃ¡ch tranh minh há»a nÃ o do Codex táº¡o, vÃ  xÃ¡c nháº­n file audio Ä‘Æ°á»£c dÃ¹ng khi xuáº¥t MP4. TÃªn cÃ´ng cá»¥/model táº¡o mascot hiá»‡n ghi â€œKhÃ´ng nhá»›â€; giá»ng Microsoft Neural TTS hiá»‡n ghi cÃ¡ch dÃ¹ng Edge TTS qua `edge-tts`. TrÃºc nghe toÃ n bá»™ clip Ä‘á»ƒ Ä‘á»‘i chiáº¿u 28 cue (ná»™i dung, thá»i Ä‘iá»ƒm xuáº¥t hiá»‡n, Ã¢m thanh cÃ³ Ã½ nghÄ©a cáº§n chÃº thÃ­ch). Product owner chá»‰ Ä‘á»‹nh historical/media reviewer. AI Ä‘Ã£ hoÃ n táº¥t pháº§n kiá»ƒm tra file, rÃ  tÃ i liá»‡u vÃ  láº­p sá»• thiáº¿u sÃ³t cÃ³ thá»ƒ thá»±c hiá»‡n trong pháº¡m vi hiá»‡n táº¡i; chÆ°a cÃ³ cÆ¡ sá»Ÿ tá»± cáº¥p quyá»n hoáº·c tá»± sign-off. Task váº«n IN PROGRESS, reference chÆ°a Ä‘á»§ acceptance Ä‘á»ƒ REVIEW/DONE.

## Há»“ sÆ¡ review sÆ¡ bá»™ â€” TrÆ°á»›c cÆ¡n bÃ£o (2026-09-24)

Tráº¡ng thÃ¡i: DRAFT / REFERENCE_ONLY. Kiá»ƒm kÃª tÃ i liá»‡u Ä‘Ã£ hoÃ n táº¥t; chÆ°a Ä‘áº¡t historical/media sign-off. Hash video Ä‘á»c láº¡i trong lÆ°á»£t kiá»ƒm kÃª váº«n lÃ  `2b7def3cd371275f73f062707b9cd212bca663b4b8e66eeb980272b5c092f0ec`.

### Má»¥c tiÃªu vÃ  hÆ°á»›ng dÃ¹ng Ä‘á» xuáº¥t

Objective Ä‘á»ƒ reviewer xem xÃ©t: ngÆ°á»i xem nÃªu Ä‘Æ°á»£c má»¥c tiÃªu táº­p trung lá»±c lÆ°á»£ng cá»§a Káº¿ hoáº¡ch Navarre vÃ  má»‘i liÃªn há»‡ vá»›i viá»‡c PhÃ¡p pháº£i phÃ¢n tÃ¡n lá»±c lÆ°á»£ng Ä‘á»‘i phÃ³ trÃªn nhiá»u hÆ°á»›ng. ÄÃ¢y lÃ  objective suy ra tá»« ká»‹ch báº£n, chÆ°a Ä‘Æ°á»£c duyá»‡t.

Khuyáº¿n nghá»‹ hiá»‡n táº¡i: giá»¯ clip lÃ m reference Ä‘á»ƒ Ä‘Ã¡nh giÃ¡ cÃ¡ch trÃ¬nh bÃ y video, caption vÃ  media handoff. Clip táº­p trung bá»‘i cáº£nh khÃ¡ng chiáº¿n chá»‘ng PhÃ¡p nÄƒm 1953â€“1954; khÃ´ng phÃ¹ há»£p Ä‘á»ƒ tá»± chá»n lÃ m lesson canonical cá»§a pháº¡m vi khÃ¡ng chiáº¿n chá»‘ng Má»¹ trong AGENTS. Äá» xuáº¥t video-led lesson nÄƒm 1954 á»Ÿ trao Ä‘á»•i trÆ°á»›c khÃ´ng pháº£i quyáº¿t Ä‘á»‹nh sáº£n pháº©m vÃ  khÃ´ng Ä‘Æ°á»£c triá»ƒn khai.

Ba hÆ°á»›ng cá»§a task: video-led lesson cÃ³ thá»ƒ táº­n dá»¥ng lá»i dáº«n liá»n máº¡ch nhÆ°ng vÆ°á»›ng pháº¡m vi ná»™i dung; tÆ° liá»‡u VN cáº§n scene/objective Ä‘Ã£ duyá»‡t vÃ  Ä‘oáº¡n cáº¯t tÆ°Æ¡ng á»©ng, hiá»‡n chÆ°a cÃ³; ná»™i dung má»Ÿ rá»™ng chá»‰ lÃ  Ä‘á» xuáº¥t náº¿u Product owner cháº¥p thuáº­n bá»‘i cáº£nh vÃ  historical reviewer duyá»‡t. ChÆ°a cÃ³ hÆ°á»›ng tÃ­ch há»£p nÃ o Ä‘Æ°á»£c chá»‘t.

### Kiá»ƒm kÃª vÃ  evidence

| Háº¡ng má»¥c | ÄÃ£ tháº¥y / Ä‘Ã£ kiá»ƒm tra | CÃ²n thiáº¿u |
|---|---|---|
| Video | File Ä‘Ã£ xÃ¡c nháº­n, 19.289.629 byte; hash nÃªu trÃªn | Äá»c trá»±c tiáº¿p stream, decode/playback vÃ  thá»­ thiáº¿t bá»‹/network cho báº£n hiá»‡n táº¡i |
| VTT | `public/media/truoc-con-bao/subtitles.vtt`: 28 cue; text/start/end khá»›p 28 cue trong `cues.json`; khÃ´ng overlap, khÃ´ng duration Ã¢m, káº¿t thÃºc 93,389 giÃ¢y | Nghe Ä‘á»‘i chiáº¿u audio tháº­t; kiá»ƒm tra Ã¢m thanh phi lá»i nÃ³i cáº§n chÃº thÃ­ch vÃ  tá»‘c Ä‘á»™ Ä‘á»c trÃªn mobile |
| Transcript | `src/data/episodeEditorial.ts` cÃ³ 7 Ä‘oáº¡n tÃ³m táº¯t; lá»i dáº«n gá»‘c trong `scripts/media/narrative.py`; báº£n tá»« VTT á»Ÿ dÆ°á»›i | Báº£n trong app khÃ´ng nguyÃªn vÄƒn: thÃªm má»‘c 1946 vÃ  diá»…n giáº£i, bá» lá»i dáº«n. ChÆ°a thá»ƒ ghi transcript khá»›p audio cuá»‘i |
| Poster | ÄÃ£ xem `public/media/truoc-con-bao/poster.png`: tranh dá»c, Sá»¬u trÆ°á»›c nÃºi/thung lÅ©ng, chá»¯ â€œHELLO! Sá»¬u Ä‘Ã¢y!â€, nhÃ£n 1954 | ChÆ°a hiá»ƒn thá»‹ tÃªn â€œTrÆ°á»›c cÆ¡n bÃ£oâ€; cáº§n quyáº¿t Ä‘á»‹nh biÃªn táº­p. ChÆ°a kiá»ƒm tra mobile/performance; file 1.799.869 byte |
| Audio | CÃ³ `episode-audio-steady.m4a`, `voice-over.mp3`; cues khai bÃ¡o `vi-VN-NamMinhNeural` | XÃ¡c nháº­n file audio nÃ o thá»±c sá»± Ä‘Æ°á»£c nhÃºng; báº±ng chá»©ng quyá»n sá»­ dá»¥ng giá»ng vÃ  nháº¡c/SFX |
| HÃ¬nh/map | Script tham chiáº¿u mascot, convoy, áº£nh minh há»a binh lÃ­nh/thung lÅ©ng, map vÃ  icons trong `public/media/shared/`; hai JSON map mÃ´ táº£ Natural Earth | Manifest asset thá»±c sá»± dÃ¹ng trong MP4 hiá»‡n táº¡i; tÃ¡c giáº£/chá»§ quyá»n, nguá»“n gá»‘c, license/permission vÃ  nhÃ£n minh há»a cá»§a tá»«ng asset |
| Fallback | CÃ³ vÄƒn báº£n dá»± tháº£o bÃªn dÆ°á»›i | ChÆ°a Ä‘Æ°á»£c review vÃ  tÃ­ch há»£p, chÆ°a cÃ³ mÃ´ táº£ Ä‘áº§y Ä‘á»§ thÃ´ng tin chá»‰ thá»ƒ hiá»‡n báº±ng hÃ¬nh áº£nh |
| Rendition | CÃ³ `episode-portrait-upgraded-telegram.mp4` vÃ  `episode-portrait-upgraded-cinematic.mp4` | TÃªn file khÃ´ng chá»©ng minh lÃ  rendition tÆ°Æ¡ng Ä‘Æ°Æ¡ng; cáº§n Ä‘á»‘i chiáº¿u ná»™i dung/version vÃ  budget trÆ°á»›c khi chá»n |

Report `episode-portrait-final-sync-verification.json` ghi hash `fcc10f8a92b370effc2c648de007939f112043f610c30a1b4aa69bc2a071d489`, khÃ¡c MP4 hiá»‡n táº¡i. Report icon-only cÅ©ng ghi hash khÃ¡c vÃ  Ä‘Æ°á»ng dáº«n render khÃ¡c. KhÃ´ng chuyá»ƒn cÃ¡c káº¿t quáº£ â€œfullDecode passedâ€/â€œaudioCorrelationâ€ cÅ© thÃ nh QA pass cá»§a file hiá»‡n táº¡i.

### Nguá»“n lá»‹ch sá»­ vÃ  báº£ng claim Ä‘á»ƒ reviewer tiáº¿p tá»¥c

- S1: [Káº¿ hoáº¡ch Navarre â€” Báº£o tÃ ng Chiáº¿n tháº¯ng Äiá»‡n BiÃªn Phá»§](https://btctdbp.svhttdl.dienbien.gov.vn/portal/pages/2015/Tham-vong-cua-Navarre-trong-ban-ke-hoach-mang-ten-niqdbvc3sab5.aspx). URL láº¥y tá»« `episodeEditorial.ts`; láº§n truy cáº­p 2026-09-24 tráº£ lá»—i 502 qua cÃ´ng cá»¥ Ä‘á»c web. ChÆ°a kiá»ƒm chá»©ng ná»™i dung, khÃ´ng káº¿t luáº­n link há»ng vÄ©nh viá»…n.
- S2: [Tháº¥t báº¡i cá»§a Káº¿ hoáº¡ch Navarre vÃ  sá»± ra Ä‘á»i cá»§a Táº­p Ä‘oÃ n cá»© Ä‘iá»ƒm Äiá»‡n BiÃªn Phá»§](https://svhttdl.dienbien.gov.vn/ditich/pages/2014/That-bai-cua-Ke-hoach-Navarre-va-su-ra-doi-cua-Tap-9937.aspx), Há»“ng Nhung, Báº£o tÃ ng Chiáº¿n tháº¯ng LS ÄBP; Ä‘Äƒng 09-03-2014, Ä‘á»c 2026-09-24. Äá»c Ä‘Æ°á»£c bÃ i; cÃ³ ná»™i dung vá» nÄƒm 1953, nhiá»u hÆ°á»›ng tiáº¿n cÃ´ng vÃ  phÃ¢n tÃ¡n lá»±c lÆ°á»£ng. Footer yÃªu cáº§u sá»± Ä‘á»“ng Ã½ báº±ng vÄƒn báº£n khi phÃ¡t hÃ nh láº¡i thÃ´ng tin; chÆ°a cÃ³ báº±ng chá»©ng cáº¥p phÃ©p sao chÃ©p media/ná»™i dung tá»« trang. Dáº«n nguá»“n khÃ´ng Ä‘á»“ng nghÄ©a cÃ³ quyá»n tÃ¡i sá»­ dá»¥ng asset.

| Claim / Ä‘oáº¡n VTT | PhÃ¢n loáº¡i dá»± kiáº¿n | Evidence / viá»‡c cáº§n reviewer lÃ m |
|---|---|---|
| 00:09â€“00:20, chiáº¿n tranh Ä‘Ã£ kÃ©o dÃ i nhiá»u nÄƒm | Fact + diá»…n giáº£i | Cáº§n nguá»“n cÃ³ locator cho thá»i ká»³; chÆ°a Ä‘Ã¡nh dáº¥u verified |
| 00:20â€“00:39, chi phÃ­/quÃ¢n sá»±/tháº¿ chá»§ Ä‘á»™ng phÃ­a PhÃ¡p | Fact + diá»…n giáº£i | S1 chÆ°a Ä‘á»c Ä‘Æ°á»£c; cáº§n chá»©ng cá»© riÃªng cho tá»«ng Ã½, trÃ¡nh coi má»™t link chá»©ng minh cáº£ Ä‘oáº¡n |
| 00:39â€“00:54, Navarre nÄƒm 1953 vÃ  má»¥c tiÃªu | Fact + tÃ³m táº¯t | S2 Ä‘oáº¡n báº¯t Ä‘áº§u â€œÄáº§u thÃ¡ng 5 nÄƒm 1953â€ há»— trá»£ bá»‘i cáº£nh thá»i gian; má»¥c tiÃªu cáº§n Ä‘á»‘i chiáº¿u S1/nguá»“n bá»• sung |
| 00:58â€“01:07, nhiá»u hÆ°á»›ng vÃ  PhÃ¡p Ä‘iá»u quÃ¢n | Quan há»‡ nhÃ¢n quáº£ | S2 Ä‘oáº¡n báº¯t Ä‘áº§u â€œVá» phÃ­a Viá»‡t Namâ€ há»— trá»£ sÆ¡ bá»™; reviewer kiá»ƒm tra niÃªn biá»ƒu vÃ  má»©c Ä‘á»™ khÃ¡i quÃ¡t |
| 01:17â€“01:29, Äiá»‡n BiÃªn Phá»§/thung lÅ©ng TÃ¢y Báº¯c/tÃ¢m Ä‘iá»ƒm | Fact Ä‘á»‹a lÃ½ + cÃ¢u dáº«n chuyá»‡n | S2 cÃ¡c Ä‘oáº¡n Ä‘áº§u vÃ  pháº§n cuá»‘i há»— trá»£ sÆ¡ bá»™; cÃ¢u há»i á»Ÿ cuá»‘i lÃ  dáº«n sang táº­p sau |
| â€œmá»™t Ä‘á»‘ngâ€, â€œrá»‘i nhÆ° tÆ¡ vÃ²â€, Sá»¬u chÃ o ngÆ°á»i xem | BiÃªn ká»‹ch/áº©n dá»¥ | KhÃ´ng trÃ¬nh bÃ y nhÆ° lá»i trÃ­ch lá»‹ch sá»­; reviewer xem tone |

Táº¥t cáº£ claim váº«n CHá»œ REVIEW. KhÃ´ng cÃ³ historical reviewer Ä‘Æ°á»£c chá»‰ Ä‘á»‹nh, khÃ´ng cÃ³ sign-off trong há»“ sÆ¡ nÃ y.

### Transcript dá»± tháº£o tá»« VTT

Nguá»“n: ná»‘i nguyÃªn vÄƒn ná»™i dung 28 cue trong VTT hiá»‡n táº¡i thÃ nh Ä‘oáº¡n Ä‘á»c. ÄÃ¢y lÃ  báº£n Ä‘á»‘i chiáº¿u vÄƒn báº£n, chÆ°a nghe xÃ¡c nháº­n vá»›i audio cá»§a MP4.

Hello, Sá»¬u Ä‘Ã¢y! TrÆ°á»›c khi nÃ³i tá»›i Äiá»‡n BiÃªn Phá»§, cho Sá»¬u tua ngÆ°á»£c thá»i gian má»™t chÃºt nha. Äáº§u nhá»¯ng nÄƒm 1950, cuá»™c khÃ¡ng chiáº¿n chá»‘ng PhÃ¡p Ä‘Ã£ kÃ©o dÃ i nhiá»u nÄƒm rá»“i. VÃ  cÃ ng kÃ©o dÃ i thÃ¬ chiáº¿n trÆ°á»ng cÃ ng cÄƒng.

Vá» phÃ­a PhÃ¡p, váº¥n Ä‘á» báº¯t Ä‘áº§u cháº¥t thÃ nhâ€¦ má»™t Ä‘á»‘ng. Chi phÃ­ chiáº¿n tranh lá»›n, tÃ¬nh hÃ¬nh quÃ¢n sá»± khÃ³ khÄƒn, mÃ  tháº¿ chá»§ Ä‘á»™ng thÃ¬ cÅ©ng khÃ´ng cÃ²n dá»… giá»¯ nhÆ° trÆ°á»›c. NÃ³i Ä‘Æ¡n giáº£n lÃ : cá»© tiáº¿p tá»¥c nhÆ° váº­y thÃ¬ khÃ´ng á»•n.

Tháº¿ lÃ  nÄƒm 1953, PhÃ¡p triá»ƒn khai Káº¿ hoáº¡ch Navarre. Má»¥c tiÃªu? Táº­p trung lá»±c lÆ°á»£ng, giÃ nh láº¡i tháº¿ chá»§ Ä‘á»™ng vÃ  tÃ¬m cÃ¡ch táº¡o ra má»™t chuyá»ƒn biáº¿n quÃ¢n sá»± cÃ³ lá»£i. Nghe á»•n Ä‘Ãºng khÃ´ng? NhÆ°ng cÃ³ má»™t váº¥n Ä‘á» nhá»â€¦

PhÃ­a Viá»‡t Nam cÅ©ng Ä‘ang chá»§ Ä‘á»™ng hoáº¡t Ä‘á»™ng trÃªn nhiá»u hÆ°á»›ng. QuÃ¢n PhÃ¡p pháº£i Ä‘iá»u lá»±c lÆ°á»£ng Ä‘i Ä‘á»‘i phÃ³ á»Ÿ nhiá»u nÆ¡i. ThÃ nh ra trÃªn báº£n Ä‘á»“ lÃºc nÃ y, má»i thá»© báº¯t Ä‘áº§uâ€¦ rá»‘i nhÆ° tÆ¡ vÃ².

VÃ  rá»“i cÃ³ má»™t cÃ¡i tÃªn báº¯t Ä‘áº§u xuáº¥t hiá»‡n. Äiá»‡n BiÃªn Phá»§. Má»™t thung lÅ©ng á»Ÿ TÃ¢y Báº¯c. NhÆ°ng táº¡i sao má»™t nÆ¡i á»Ÿ táº­n Ä‘Ã¢y láº¡i trá»Ÿ thÃ nh tÃ¢m Ä‘iá»ƒm cá»§a cáº£ cuá»™c chiáº¿n? ÄÃ³ lÃ  chuyá»‡n cá»§a táº­p sau. Äi thÃ´i!

### Fallback, mÃ´ táº£ vÃ  attribution dá»± tháº£o

- ThÃ´ng bÃ¡o fallback: â€œVideo hiá»‡n chÆ°a táº£i Ä‘Æ°á»£c. Báº¡n cÃ³ thá»ƒ Ä‘á»c lá»i dáº«n cá»§a â€˜TrÆ°á»›c cÆ¡n bÃ£oâ€™ bÃªn dÆ°á»›i vÃ  thá»­ táº£i láº¡i.â€ DÃ¹ng transcript á»Ÿ trÃªn sau review; cáº§n bá»• sung mÃ´ táº£ hÃ¬nh áº£nh quan trá»ng sau khi xem toÃ n clip. KhÃ´ng coi fallback lÃ  Ä‘Ã£ triá»ƒn khai hoáº·c cÃ³ quyá»n tá»± ghi completion/reward.
- Alt poster dá»± tháº£o, dá»±a trÃªn áº£nh Ä‘Ã£ xem: â€œSá»¬u Ä‘á»™i nÃ³n lÃ¡ váº«y tay trÆ°á»›c phong cáº£nh nÃºi vÃ  thung lÅ©ng, cáº¡nh há»“ sÆ¡ giáº¥y; chá»¯ â€˜Hello! Sá»¬u Ä‘Ã¢y!â€™.â€ ÄÃ¢y lÃ  tranh minh há»a, chÆ°a xÃ¡c minh mÃ´ táº£ Ä‘á»‹a danh cá»¥ thá»ƒ.
- Attribution template tá»«ng asset: `TÃªn asset | tÃ¡c giáº£/chá»§ quyá»n | URL nguá»“n | license hoáº·c vÄƒn báº£n cho phÃ©p | thay Ä‘á»•i Ä‘Ã£ lÃ m | nhÃ£n minh há»a/AI náº¿u cÃ³ | reviewer`. Äiá»n UNKNOWN cho chá»— chÆ°a cÃ³ chá»©ng cá»©; khÃ´ng suy license tá»« viá»‡c file cÃ³ trong repo.

### Handoff sau kiá»ƒm kÃª

Executor váº«n lÃ  TrÃºc. Viá»‡c káº¿ tiáº¿p: thu tháº­p nguá»“n/quyá»n sá»­ dá»¥ng cá»§a tá»«ng asset theo template vÃ  Ä‘á»‘i chiáº¿u lá»i dáº«n/phá»¥ Ä‘á» vá»›i MP4 cÃ³ hash Ä‘Ã£ chá»‘t. Product owner cáº§n chá»‰ Ä‘á»‹nh historical/media reviewer Ä‘á»ƒ tiáº¿p nháº­n há»“ sÆ¡ vÃ  quyáº¿t Ä‘á»‹nh pháº¡m vi sá»­ dá»¥ng. Há»“ sÆ¡ Ä‘Ã£ liá»‡t kÃª Ä‘á»§ cÃ¡c khoáº£ng trá»‘ng; task nguá»“n giá»¯ IN PROGRESS vÃ¬ kiá»ƒm tra media thá»±c táº¿ vÃ  nguá»“n/license chÆ°a Ä‘áº¡t acceptance. ChÆ°a gá»­i thÃ´ng Ä‘iá»‡p cho ngÆ°á»i khÃ¡c.

## TrÃ¬nh tá»± task gá»‘c Ä‘á»ƒ tham chiáº¿u

HoÃ n táº¥t **má»™t gÃ³i nháº­n diá»‡n vÃ  Ä‘Ã¡nh giÃ¡ video reference** theo `CONTENT-006`, trÆ°á»›c khi quyáº¿t Ä‘á»‹nh dÃ¹ng video theo hÆ°á»›ng nÃ o. KhÃ´ng báº¯t Ä‘áº§u code hoáº·c Ä‘Æ°a media vÃ o app trong pháº§n viá»‡c bÃ n giao nÃ y.

### TrÃ¬nh tá»± thá»±c hiá»‡n

1. **ÄÃ£ chá»‘t clip theo xÃ¡c nháº­n TrÃºc**: dÃ¹ng `public/media/kccm/1968-mau-than/videos/episode-portrait-final.mp4` vÃ  SHA-256 Táº­p 1 Ä‘Ã£ ghi á»Ÿ trÃªn Ä‘á»ƒ review. Náº¿u file thay Ä‘á»•i, ghi nháº­n phiÃªn báº£n/hash má»›i trÆ°á»›c khi dÃ¹ng láº¡i evidence. KhÃ´ng Ä‘á»•i tÃªn, ghi Ä‘Ã¨ hoáº·c xÃ³a media trong pháº§n viá»‡c bÃ n giao nÃ y.

2. **Láº­p há»“ sÆ¡ Ä‘Ã¡nh giÃ¡**: ghi Ä‘Æ°á»ng dáº«n file Ä‘Æ°á»£c xÃ¡c Ä‘á»‹nh, thá»i lÆ°á»£ng/kÃ­ch thÆ°á»›c/khung hÃ¬nh, nguá»“n gá»‘c vÃ  quyá»n sá»­ dá»¥ng, má»¥c tiÃªu há»c táº­p dá»± kiáº¿n, ba lá»±a chá»n sá»­ dá»¥ng (video-led lesson, tÆ° liá»‡u trong Visual Novel, ná»™i dung má»Ÿ rá»™ng), cÃ¹ng khuyáº¿n nghá»‹ cÃ³ lÃ½ do. Má»i dá»¯ kiá»‡n lá»‹ch sá»­ pháº£i gáº¯n nguá»“n cÃ³ thá»ƒ truy váº¿t; khÃ´ng suy diá»…n tá»« hÃ¬nh áº£nh hoáº·c lá»i ká»ƒ cá»§a AI.

3. **Liá»‡t kÃª pháº§n media cÃ²n thiáº¿u**: transcript, phá»¥ Ä‘á» tiáº¿ng Viá»‡t Ä‘á»“ng bá»™ (ká»ƒ cáº£ Ã¢m thanh cÃ³ Ã½ nghÄ©a), poster, mÃ´ táº£ hÃ¬nh áº£nh quan trá»ng, attribution vÃ  phÆ°Æ¡ng Ã¡n thay tháº¿ khi video khÃ´ng táº£i Ä‘Æ°á»£c. Chá»‰ Ä‘Ã¡nh dáº¥u Ä‘áº¡t khi Ä‘Ã£ kiá»ƒm tra báº£n media cá»¥ thá»ƒ vÃ  cÃ³ báº±ng chá»©ng.

4. **BÃ n giao review**: Ä‘á» nghá»‹ Product owner chá»‰ Ä‘á»‹nh historical reviewer/media reviewer. Gá»­i há»“ sÆ¡ cho Thá» vÃ  reviewer Ä‘Æ°á»£c chá»‰ Ä‘á»‹nh; TrÃºc váº«n lÃ  executor duy nháº¥t. KhÃ´ng chuyá»ƒn `CONTENT-006` sang `DONE` khi chÆ°a cÃ³ review chuyÃªn mÃ´n vÃ  báº±ng chá»©ng Ä‘áº¡t acceptance.

## Pháº¡m vi vÃ  Ä‘áº§u ra

- **Trong pháº¡m vi**: xÃ¡c Ä‘á»‹nh Ä‘Ãºng reference, láº­p há»“ sÆ¡ nguá»“n/media, Ä‘á» xuáº¥t hÆ°á»›ng sá»­ dá»¥ng vÃ  learning objective, ghi thiáº¿u sÃ³t/Ä‘iá»ƒm cáº§n reviewer quyáº¿t Ä‘á»‹nh.
- **NgoÃ i pháº¡m vi**: sá»­a á»©ng dá»¥ng; tÃ­ch há»£p hoáº·c publish video; sáº£n xuáº¥t video MVP theo screenplay. Video MVP thuá»™c `CONTENT-007`, hiá»‡n `BLOCKED` cho Ä‘áº¿n khi dependency cá»§a task Ä‘Ã³ Ä‘Æ°á»£c gá»¡.
- **Äáº§u ra**: má»™t há»“ sÆ¡ review Ä‘Æ°á»£c liÃªn káº¿t tá»« task card `CONTENT-006`, Ä‘á»§ Ä‘á»ƒ reviewer quyáº¿t Ä‘á»‹nh vÃ  ngÆ°á»i nháº­n task tiáº¿p theo hiá»ƒu tráº¡ng thÃ¡i media. Náº¿u chÆ°a cÃ³ reviewer hoáº·c license/source chÆ°a rÃµ thÃ¬ giá»¯ blocker, khÃ´ng tá»± phÃª duyá»‡t.
- **Executor**: TrÃºc. Thá»/Product owner/historical reviewer lÃ  ngÆ°á»i phá»‘i há»£p hoáº·c reviewer, khÃ´ng pháº£i Ä‘á»“ng executor.

## Quy trÃ¬nh vÃ  tÃ i liá»‡u cáº§n dÃ¹ng

Trong repo hiá»‡n khÃ´ng tÃ¬m tháº¥y `SKILL.md` chuyÃªn biá»‡t cho video production hoáº·c historical/media review. Quy trÃ¬nh phÃ¹ há»£p hiá»‡n Ä‘Æ°á»£c quy Ä‘á»‹nh táº¡i:

- [`AGENTS.md`](../../../AGENTS.md) â€” claim task, má»™t executor, checkpoint, handoff vÃ  giá»›i háº¡n lá»‹ch sá»­/media.
- [`docs/tasks/README.md`](../README.md) â€” vÃ²ng Ä‘á»i task vÃ  cÃ¡ch Ä‘á»“ng bá»™ board/card.
- [`Phase 3: Historical & Media Governance`](../../specs/phases/03-historical-media-governance.md) â€” provenance, license, source, phÃ¢n loáº¡i claim vÃ  checklist media.
- [`Phase 8: QA, Accessibility & Release`](../../specs/phases/08-qa-accessibility-release-spec.md) â€” caption/transcript, fallback, kháº£ nÄƒng truy cáº­p vÃ  kiá»ƒm tra trÃªn thiáº¿t bá»‹.
- [`CONTENT-006`](./CONTENT-006.md) â€” acceptance, dependency vÃ  checkpoint cá»¥ thá»ƒ cá»§a task.

CÃ¡c tÃ i liá»‡u nÃ y lÃ  quy trÃ¬nh dá»± Ã¡n cáº§n tuÃ¢n theo; handoff nÃ y khÃ´ng tá»± táº¡o hay cÃ i thÃªm skill/plugin.

## Model AI phÃ¹ há»£p

- **Khuyáº¿n nghá»‹: GPT-6 Astra** Ä‘á»ƒ Ä‘á»c/tá»•ng há»£p nguá»“n Ä‘Ã£ cung cáº¥p, Ä‘á»‘i chiáº¿u há»“ sÆ¡ media vá»›i checklist Phase 3/8, láº­p báº£ng claimâ€“source vÃ  rÃ  tÃ­nh nháº¥t quÃ¡n transcript/caption. Chá»‰ dÃ¹ng nguá»“n cÃ³ thá»ƒ kiá»ƒm tra; yÃªu cáº§u nÃªu chá»— thiáº¿u chá»©ng cá»© thay vÃ¬ tá»± Ä‘iá»n.
- **GPT-6 Sol** phÃ¹ há»£p náº¿u chá»‰ cáº§n trá»£ giÃºp thao tÃ¡c há»“ sÆ¡, chuáº©n hÃ³a metadata hoáº·c checklist ngáº¯n. KhÃ´ng cáº§n model coding cho task nÃ y vÃ¬ Ä‘áº§u ra lÃ  review media, khÃ´ng pháº£i thay Ä‘á»•i code.
- AI khÃ´ng xÃ¡c nháº­n lá»‹ch sá»­, quyá»n sá»­ dá»¥ng hoáº·c license thay reviewer cÃ³ tháº©m quyá»n; khÃ´ng giao AI tá»± biÃªn táº­p/publish ná»™i dung lá»‹ch sá»­.

## Äiá»u kiá»‡n hoÃ n táº¥t vÃ  kiá»ƒm tra

- [x] ÄÃ£ phÃ¢n biá»‡t hai á»©ng viÃªn; TrÃºc xÃ¡c nháº­n â€œTrÆ°á»›c cÆ¡n bÃ£oâ€ lÃ  clip cáº§n review.
- [ ] CÃ³ metadata, nguá»“n/license status, objective vÃ  khuyáº¿n nghá»‹ cÃ³ cÄƒn cá»©.
- [ ] CÃ³ danh sÃ¡ch tráº¡ng thÃ¡i transcript, caption, poster, attribution, mÃ´ táº£ hÃ¬nh áº£nh vÃ  fallback.
- [ ] Historical/media reviewer Ä‘Æ°á»£c Product owner chá»‰ Ä‘á»‹nh vÃ  nháº­n há»“ sÆ¡ review.
- [ ] Task card Ä‘Æ°á»£c cáº­p nháº­t evidence, blocker vÃ  next action; chá»‰ chuyá»ƒn `REVIEW` khi gÃ³i review Ä‘Ã£ sáºµn sÃ ng.

KhÃ´ng cáº§n build/typecheck vÃ¬ handoff nÃ y khÃ´ng sá»­a code. TrÆ°á»›c khi káº¿t thÃºc lÆ°á»£t lÃ m viá»‡c, kiá»ƒm tra diff cá»§a Ä‘Ãºng file handoff vÃ  ghi káº¿t quáº£ vÃ o checkpoint task card khi cÃ³ deliverable.

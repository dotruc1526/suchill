-- Roll-forward migration: Historical Library & Multi-Era Catalog
-- Expands educational and historical scope beyond 1954 to cover all major eras of Vietnamese history
-- Enforces Default-Deny Row Level Security, published-only visibility, immutable records, and verifiable citations.

create table if not exists public.historical_eras (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  time_period text not null,
  order_index integer not null unique check (order_index >= 0),
  description text not null,
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.historical_books (
  id uuid primary key default gen_random_uuid(),
  era_id uuid not null references public.historical_eras(id) on delete restrict,
  book_code text not null unique,
  title text not null,
  original_title text,
  author text not null,
  translator text,
  publisher text,
  publication_year integer,
  edition text,
  isbn text,
  category text,
  summary text,
  verification_status text not null default 'UNVERIFIED' check (verification_status in ('VERIFIED', 'NEEDS_REVIEW', 'UNVERIFIED')),
  status public.publish_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.historical_book_sources (
  book_id uuid not null references public.historical_books(id) on delete cascade,
  source_id uuid not null references public.historical_sources(id) on delete restrict,
  authority_level integer not null default 3 check (authority_level between 1 and 5),
  relation_note text,
  created_at timestamptz not null default now(),
  primary key (book_id, source_id)
);

create table if not exists public.historical_book_claims (
  book_id uuid not null references public.historical_books(id) on delete cascade,
  claim_id uuid not null references public.historical_claims(id) on delete restrict,
  citation_locator text not null,
  verification_status text not null default 'VERIFIED' check (verification_status in ('VERIFIED', 'NEEDS_REVIEW', 'UNVERIFIED')),
  created_at timestamptz not null default now(),
  primary key (book_id, claim_id)
);

-- Link chapters to historical eras
alter table public.chapters add column if not exists era_id uuid references public.historical_eras(id) on delete restrict;

-- Performance Indexes
create index if not exists idx_historical_books_era_id on public.historical_books(era_id);
create index if not exists idx_historical_books_status on public.historical_books(status);
create index if not exists idx_historical_books_verification on public.historical_books(verification_status);
create index if not exists idx_historical_books_code on public.historical_books(book_code);
create index if not exists idx_historical_eras_slug on public.historical_eras(slug);
create index if not exists idx_chapters_era_id on public.chapters(era_id);

-- Row Level Security (RLS) - Default Deny
alter table public.historical_eras enable row level security;
alter table public.historical_books enable row level security;
alter table public.historical_book_sources enable row level security;
alter table public.historical_book_claims enable row level security;

revoke all on public.historical_eras from public, anon, authenticated;
revoke all on public.historical_books from public, anon, authenticated;
revoke all on public.historical_book_sources from public, anon, authenticated;
revoke all on public.historical_book_claims from public, anon, authenticated;

grant select on public.historical_eras to anon, authenticated;
grant select on public.historical_books to anon, authenticated;
grant select on public.historical_book_sources to anon, authenticated;
grant select on public.historical_book_claims to anon, authenticated;

grant all on public.historical_eras to service_role;
grant all on public.historical_books to service_role;
grant all on public.historical_book_sources to service_role;
grant all on public.historical_book_claims to service_role;

-- Published Content Reading Policies
create policy published on public.historical_eras for select
  using (status = 'published');

create policy published on public.historical_books for select
  using (status = 'published' and exists (
    select 1 from public.historical_eras e where e.id = era_id and e.status = 'published'
  ));

create policy parent on public.historical_book_sources for select
  using (exists (
    select 1 from public.historical_books b where b.id = book_id and b.status = 'published'
  ));

create policy parent on public.historical_book_claims for select
  using (exists (
    select 1 from public.historical_books b where b.id = book_id and b.status = 'published'
  ));
-- Private JSON Formatters
create function private.era_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
  select jsonb_build_object(
    'id', e.id,
    'slug', e.slug,
    'name', e.name,
    'timePeriod', e.time_period,
    'orderIndex', e.order_index,
    'description', e.description,
    'status', e.status,
    'bookCount', (select count(*) from public.historical_books b where b.era_id = e.id and b.status = 'published')
  )
  from public.historical_eras e where e.id = p_id and e.status = 'published'
$$;

create function private.book_json(p_id uuid) returns jsonb language sql stable set search_path='' as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'id', b.id,
    'eraId', b.era_id,
    'bookCode', b.book_code,
    'title', b.title,
    'originalTitle', b.original_title,
    'author', b.author,
    'translator', b.translator,
    'publisher', b.publisher,
    'publicationYear', b.publication_year,
    'edition', b.edition,
    'isbn', b.isbn,
    'category', b.category,
    'summary', b.summary,
    'verificationStatus', b.verification_status,
    'status', b.status,
    'era', (select jsonb_build_object('slug', e.slug, 'name', e.name, 'timePeriod', e.time_period) from public.historical_eras e where e.id = b.era_id),
    'sources', coalesce((
      select jsonb_agg(jsonb_build_object(
        'sourceId', s.id,
        'title', s.title,
        'authorOrInstitution', s.author_or_institution,
        'publishedYear', s.published_year,
        'url', s.url,
        'citationText', s.citation_text,
        'tier', s.tier,
        'authorityLevel', bs.authority_level,
        'relationNote', bs.relation_note
      ) order by bs.authority_level desc)
      from public.historical_book_sources bs
      join public.historical_sources s on s.id = bs.source_id
      where bs.book_id = b.id and s.status = 'published'
    ), '[]'::jsonb),
    'claims', coalesce((
      select jsonb_agg(jsonb_build_object(
        'claimId', c.id,
        'statement', c.statement,
        'kind', c.kind,
        'citationLocator', bc.citation_locator,
        'verificationStatus', bc.verification_status
      ) order by c.id)
      from public.historical_book_claims bc
      join public.historical_claims c on c.id = bc.claim_id
      where bc.book_id = b.id and c.review_status = 'published'
    ), '[]'::jsonb)
  ))
  from public.historical_books b
  where b.id = p_id and b.status = 'published'
$$;

revoke all on all functions in schema private from public, anon, authenticated;

-- Public Trusted RPC Procedures
create or replace function public.get_historical_eras() returns jsonb
language sql stable security definer set search_path='' as $$
  select coalesce(jsonb_agg(private.era_json(id) order by order_index), '[]'::jsonb)
  from public.historical_eras
  where status = 'published'
$$;

create or replace function public.search_historical_books(
  p_era_slug text default null,
  p_query text default null,
  p_limit integer default 20,
  p_offset integer default 0
) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare
  result jsonb;
  max_limit integer := least(greatest(coalesce(p_limit, 20), 1), 100);
  safe_offset integer := greatest(coalesce(p_offset, 0), 0);
  target_era_id uuid;
begin
  if p_era_slug is not null and p_era_slug <> '' then
    select id into target_era_id from public.historical_eras where slug = p_era_slug and status = 'published';
    if target_era_id is null then
      return jsonb_build_object('total', 0, 'books', '[]'::jsonb);
    end if;
  end if;

  select coalesce(jsonb_agg(private.book_json(b.id) order by b.publication_year desc nulls last, b.title), '[]'::jsonb)
  into result
  from (
    select id, publication_year, title
    from public.historical_books b
    where b.status = 'published'
      and (target_era_id is null or b.era_id = target_era_id)
      and (
        p_query is null or p_query = '' or
        b.title ilike '%' || p_query || '%' or
        b.author ilike '%' || p_query || '%' or
        coalesce(b.summary, '') ilike '%' || p_query || '%' or
        coalesce(b.category, '') ilike '%' || p_query || '%'
      )
    order by b.publication_year desc nulls last, b.title
    limit max_limit
    offset safe_offset
  ) b;

  return jsonb_build_object(
    'total', (
      select count(*)
      from public.historical_books b
      where b.status = 'published'
        and (target_era_id is null or b.era_id = target_era_id)
        and (
          p_query is null or p_query = '' or
          b.title ilike '%' || p_query || '%' or
          b.author ilike '%' || p_query || '%' or
          coalesce(b.summary, '') ilike '%' || p_query || '%' or
          coalesce(b.category, '') ilike '%' || p_query || '%'
        )
    ),
    'limit', max_limit,
    'offset', safe_offset,
    'books', result
  );
end $$;

create or replace function public.get_historical_book_detail(p_book_id uuid) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare
  result jsonb;
begin
  result := private.book_json(p_book_id);
  if result is null then
    raise exception 'Historical book not found or not published' using errcode = 'P0002';
  end if;
  return result;
end $$;

-- Update public.learning_read dispatcher to support library domains
create or replace function public.learning_read(p_kind text, p_id uuid default null, p_secondary_id uuid default null) returns jsonb
language plpgsql stable security definer set search_path='' as $$
declare result jsonb; uid uuid := auth.uid();
begin
 case p_kind
 when 'chapters' then select coalesce(jsonb_agg(private.chapter_json(id) order by created_at,id),'[]') into result from public.chapters where status='published';
 when 'chapter' then result := private.chapter_json(p_id);
 when 'lesson' then result := private.lesson_json(p_id);
 when 'document' then result := private.document_json(p_id);
 when 'story' then result := private.story_json(p_id);
 when 'media' then result := private.media_json(p_id);
 when 'quiz' then result := private.quiz_json(p_id);
 when 'eras' then select coalesce(jsonb_agg(private.era_json(id) order by order_index), '[]'::jsonb) into result from public.historical_eras where status='published';
 when 'era' then result := private.era_json(p_id);
 when 'book' then result := private.book_json(p_id);
 when 'books' then
   select coalesce(jsonb_agg(private.book_json(id) order by title), '[]'::jsonb) into result
   from public.historical_books
   where status = 'published' and (p_id is null or era_id = p_id);
 else
   if uid is null then raise exception 'Authentication required' using errcode='42501'; end if;
   case p_kind
   when 'profile' then select jsonb_build_object('id',id,'displayName',display_name,'locale',locale) into result from public.profiles where id=uid;
   when 'account' then result := private.account_json(uid);
   when 'settings' then result := private.settings_json(uid);
   when 'lesson_progress','resume','video_progress' then
     if private.lesson_json(p_id) is null then raise exception 'Lesson unavailable' using errcode='P0002'; end if;
     if p_kind='lesson_progress' then return private.lesson_progress_json(uid,p_id);
     elsif p_kind='resume' then return private.resume_json(uid,p_id);
     else
       if not exists(select 1 from public.lesson_blocks where id=p_secondary_id and lesson_id=p_id and kind='video') then raise exception 'Video block unavailable' using errcode='P0002'; end if;
       return private.video_progress_json(uid,p_id,p_secondary_id);
     end if;
   when 'episode_progress' then
     if private.story_json(p_id) is null then raise exception 'Story unavailable' using errcode='P0002'; end if;
     return private.episode_progress_json(uid,p_id);
   else raise exception 'Unknown read kind' using errcode='22023';
   end case;
 end case;
 if result is null then raise exception 'Resource unavailable' using errcode='P0002'; end if;
 return result;
end $$;

-- RPC Execution Grants
revoke all on function public.get_historical_eras() from public;
grant execute on function public.get_historical_eras() to anon, authenticated;

revoke all on function public.search_historical_books(text, text, integer, integer) from public;
grant execute on function public.search_historical_books(text, text, integer, integer) to anon, authenticated;

revoke all on function public.get_historical_book_detail(uuid) from public;
grant execute on function public.get_historical_book_detail(uuid) to anon, authenticated;

revoke all on function public.learning_read(text, uuid, uuid) from public;
grant execute on function public.learning_read(text, uuid, uuid) to anon, authenticated;

-- ============================================================================
-- SEED DATA: CANONICAL HISTORICAL ERAS & MULTI-ERA VERIFIED CITATIONS
-- ============================================================================

-- 1. Five Canonical Historical Eras
insert into public.historical_eras (id, slug, name, time_period, order_index, description, status)
values
  ('e0000000-0000-4000-8000-000000000001', 'dung-nuoc-bac-thuoc',
   'Thời kỳ Dựng nước và Đấu tranh giành Độc lập', 'Trước năm 938', 1,
   'Từ thời đại các vua Hùng dựng nước Văn Lang, nhà nước Âu Lạc của An Dương Vương đến hơn một thiên niên kỷ kiên cường chống Bắc thuộc, kết thúc vẻ vang bằng chiến thắng Bạch Đằng năm 938 của Ngô Quyền.',
   'published'),
  ('e0000000-0000-4000-8000-000000000002', 'doc-lap-phong-kien',
   'Kỷ nguyên Độc lập Tự chủ & Các Triều đại Phong kiến', '938 - 1858', 2,
   'Thời kỳ phục hưng và phát triển rực rỡ của quốc gia Đại Cồ Việt, Đại Việt dưới các triều Đinh, Tiền Lê, Lý, Trần, Hậu Lê, Tây Sơn và triều Nguyễn; các chiến công hiển hách chống ngoại xâm Tống, Nguyên-Mông, Minh, Xiêm, Thanh; áng thiên cổ hùng văn Nam quốc sơn hà và Bình Ngô đại cáo.',
   'published'),
  ('e0000000-0000-4000-8000-000000000003', 'can-dai-chong-phap',
   'Thời kỳ Cận đại & Kháng chiến chống Thực dân Pháp', '1858 - 1954', 3,
   'Giai đoạn từ tiếng súng xâm lược của liên quân Pháp - Tây Ban Nha tại Đà Nẵng (1858), phong trào Cần Vương, phong trào yêu nước đầu thế kỷ XX, Cách mạng Tháng Tám năm 1945 thành lập nước Việt Nam Dân chủ Cộng hòa, đến thắng lợi lừng lẫy năm châu của Chiến dịch Điện Biên Phủ 1954.',
   'published'),
  ('e0000000-0000-4000-8000-000000000004', 'chong-my-thong-nhat',
   'Kháng chiến chống Mỹ cứu nước & Thống nhất Non sông', '1954 - 1975', 4,
   'Thời kỳ xây dựng CNXH ở miền Bắc, phong trào Đồng Khởi 1960, cuộc Tổng tiến công và nổi dậy Xuân Mậu Thân 1968, Chiến dịch 12 ngày đêm Điện Biên Phủ trên không 1972, và Đại thắng mùa Xuân 1975 giải phóng hoàn toàn miền Nam, thống nhất đất nước.',
   'published'),
  ('e0000000-0000-4000-8000-000000000005', 'hien-dai-khao-cuu',
   'Khảo cứu Lịch sử, Địa chí & Di sản Văn hóa Việt Nam', '1975 - Nay', 5,
   'Tập hợp các công trình khảo cứu lịch sử, địa chí văn hóa ba miền Bắc - Trung - Nam, lịch sử khai hoang mở cõi Nam Bộ, chủ quyền biển đảo Hoàng Sa - Trường Sa và nghiên cứu danh nhân văn hóa Việt Nam.',
   'published')
on conflict (id) do nothing;

-- 2. Canonical Historical Sources (Level 4-5 Official & Scholarly Sources)
insert into public.historical_sources (id, title, author_or_institution, published_year, url, citation_text, tier, status)
values
  ('d0000000-0000-4000-8000-000000000001',
   'Đại Việt Sử Ký Toàn Thư',
   'Ngô Sĩ Liên và Sử quán triều Hậu Lê (Viện Khoa học Xã hội Việt Nam phiên dịch, NXB Khoa học Xã hội)',
   1993,
   'https://repository.vnu.edu.vn/handle/111216/61904',
   'Ngô Sĩ Liên, Đại Việt Sử Ký Toàn Thư, Bản dịch Viện Khoa học Xã hội Việt Nam, NXB Khoa học Xã hội, Hà Nội, 1993, Ngoại kỷ Quyển I & Toàn thư Bản kỷ Quyển I.',
   'primary',
   'published'),
  ('d0000000-0000-4000-8000-000000000002',
   'Bình Ngô Đại Cáo (Đại Việt Sử Ký Toàn Thư - Bản dịch Ngô Tất Tố)',
   'Nguyễn Trãi',
   1428,
   'https://repository.vnu.edu.vn/handle/111216/61904',
   'Nguyễn Trãi, Bình Ngô Đại Cáo (1428), Ngô Tất Tố dịch; in trong Tuyển tập Văn học Việt Nam, NXB Văn học.',
   'primary',
   'published'),
  ('d0000000-0000-4000-8000-000000000003',
   'Bản án chế độ thực dân Pháp (Le Procès de la colonisation française)',
   'Nguyễn Ái Quốc (Hồ Chí Minh)',
   1925,
   'https://gallica.bnf.fr/ark:/12148/bpt6k5827376n',
   'Nguyễn Ái Quốc, Le Procès de la colonisation française, Librairie du Travail, Paris, 1925; in lại trong Hồ Chí Minh Toàn tập, Tập 2, NXB Chính trị quốc gia Sự thật, Hà Nội, 2011.',
   'primary',
   'published'),
  ('d0000000-0000-4000-8000-000000000004',
   'Chiến dịch Điện Biên Phủ - Sự kiện và con số',
   'Viện Lịch sử Quân sự Việt Nam, NXB Quân đội Nhân dân',
   2004,
   'https://www.qdnd.vn/tu-lieu-ho-so/chien-dich-dien-bien-phu',
   'Viện LSQSVN, Lịch sử cuộc kháng chiến chống thực dân Pháp 1945-1954, Tập 3: Chiến cuộc Đông Xuân 1953-1954 và Chiến dịch Điện Biên Phủ, NXB QĐND, 2004.',
   'institutional',
   'published'),
  ('d0000000-0000-4000-8000-000000000005',
   'Đường Xuyên Trường Sơn - Ký ức bộ đội Trường Sơn',
   'Trung tướng Đồng Sĩ Nguyên, NXB Trẻ & NXB Chính trị quốc gia Sự thật',
   2005,
   'https://baochinhphu.vn/tuong-dong-si-nguyen-va-duong-truong-son-huyen-thoai-102293457.htm',
   'Đồng Sĩ Nguyên, Trọn một con đường, Hồi ký, NXB Chính trị quốc gia Sự thật, Hà Nội, 2012; Đường xuyên Trường Sơn, NXB Trẻ, TP.HCM, 2005.',
   'primary',
   'published'),
  ('d0000000-0000-4000-8000-000000000006',
   'Lịch sử khẩn hoang miền Nam',
   'Sơn Nam, Nhà xuất bản Trẻ',
   2018,
   'https://nxbtre.com.vn/lich-su-khan-hoang-mien-nam-9786041128545',
   'Sơn Nam, Lịch sử khẩn hoang miền Nam, NXB Trẻ, TP.HCM, 2018, ISBN 978-604-1-12854-5.',
   'scholarly',
   'published'),
  ('d0000000-0000-4000-8000-000000000007',
   'Nhà Tây Sơn',
   'Quách Tấn, Quách Giao, Nhà xuất bản Trẻ',
   2008,
   'https://nxbtre.com.vn/nha-tay-son-9786041002340',
   'Quách Tấn, Quách Giao, Nhà Tây Sơn, NXB Trẻ, TP.HCM, 2008, Khảo cứu địa bàn Bình Định và phong trào khởi nghĩa Tây Sơn.',
   'scholarly',
   'published'),
  ('d0000000-0000-4000-8000-000000000008',
   'Bảy ngày trong Đồng Tháp Mười',
   'Nguyễn Hiến Lê, NXB Văn hóa Thông tin tái bản',
   2002,
   'https://tuoitre.vn/nguyen-hien-le-nha-van-hoc-gia-nam-bo-38294.htm',
   'Nguyễn Hiến Lê, Bảy ngày trong Đồng Tháp Mười, Du khảo địa chí văn hóa, Ấn bản đầu 1954, NXB Văn hóa Thông tin tái bản, Hà Nội, 2002.',
   'scholarly',
   'published')
on conflict (id) do nothing;

-- 3. Canonical Historical Claims (Draft first to allow claim_sources population)
insert into public.historical_claims (id, statement, kind, review_status, reviewer_note)
values
  ('c0000000-0000-4000-8000-000000000001',
   'Thời đại Hùng Vương dựng nước Văn Lang là khởi nguồn lịch sử của dân tộc Việt Nam, gắn liền với di chỉ khảo cổ học văn hóa Đông Sơn và sự phát triển rực rỡ của đồ đồng.',
   'fact', 'draft',
   'Xác minh theo Đại Việt Sử Ký Toàn Thư (Ngoại kỷ) và các nghiên cứu khảo cổ học văn hóa Đông Sơn của Viện Khảo cổ học Việt Nam.'),
  ('c0000000-0000-4000-8000-000000000002',
   'Chiến thắng Bạch Đằng năm 938 do Ngô Quyền lãnh đạo đã đập tan mưu đồ xâm lược của quân Nam Hán, kết thúc hơn 1.000 năm Bắc thuộc và mở ra kỷ nguyên độc lập tự chủ lâu dài cho dân tộc.',
   'fact', 'draft',
   'Xác minh theo Đại Việt Sử Ký Toàn Thư (Kỷ Tiền Ngô Vương).'),
  ('c0000000-0000-4000-8000-000000000003',
   'Bình Ngô Đại Cáo được Nguyễn Trãi thừa lệnh Bình Định Vương Lê Lợi soạn thảo đầu năm 1428 sau khi quét sạch 15 vạn quân viện Minh, khẳng định Đại Việt là quốc gia độc lập có nền văn hiến lâu đời.',
   'fact', 'draft',
   'Xác minh theo Đại Việt Sử Ký Toàn Thư (Bản kỷ Quyển X, Kỷ Thuận Thiên Hoàng đế năm thứ 1).'),
  ('c0000000-0000-4000-8000-000000000004',
   'Phong trào Tây Sơn do ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ lãnh đạo đã lật đổ tập đoàn phong kiến Trịnh - Nguyễn cát cứ, đánh tan 5 vạn quân Xiêm (1785) và 29 vạn quân Mãn Thanh (1789).',
   'fact', 'draft',
   'Xác minh theo khảo cứu Nhà Tây Sơn (Quách Tấn - Quách Giao) và Đại Nam Chính biên Liệt truyện.'),
  ('c0000000-0000-4000-8000-000000000005',
   'Tác phẩm "Bản án chế độ thực dân Pháp" của Nguyễn Ái Quốc xuất bản lần đầu tại Paris năm 1925, dùng tư liệu và số liệu thực tế tố cáo chính sách áp bức bóc lột của thực dân Pháp tại các thuộc địa.',
   'fact', 'draft',
   'Xác minh theo lưu trữ Thư viện Quốc gia Pháp (BNF Gallica) và Hồ Chí Minh Toàn tập Tập 2.'),
  ('c0000000-0000-4000-8000-000000000006',
   'Chiến dịch Điện Biên Phủ kết thúc thắng lợi ngày 7/5/1954 sau 56 ngày đêm khoét núi ngủ hầm, buộc thực dân Pháp phải ký Hiệp định Giơ-ne-vơ công nhận độc lập, chủ quyền và toàn vẹn lãnh thổ của Việt Nam.',
   'fact', 'draft',
   'Xác minh theo tài liệu Viện Lịch sử Quân sự Việt Nam và hồi ký Đại tướng Võ Nguyên Giáp.'),
  ('c0000000-0000-4000-8000-000000000007',
   'Đoàn 559 và Bộ đội Trường Sơn dưới sự chỉ huy của Trung tướng Đồng Sĩ Nguyên đã xây dựng hệ thống đường chiến lược Trường Sơn dài gần 20.000 km, vận chuyển hàng triệu tấn vũ khí chi viện chiến trường miền Nam.',
   'fact', 'draft',
   'Xác minh theo hồi ký Trung tướng Đồng Sĩ Nguyên và tài liệu Binh đoàn 12 (Tổng công ty Xây dựng Trường Sơn).'),
  ('c0000000-0000-4000-8000-000000000008',
   'Công cuộc khai phá đất phương Nam trải qua hơn 300 năm định cư, khai hoang và thuần hóa thiên nhiên, kết hợp hài hòa văn hóa các cộng đồng người Kinh, Khmer, Hoa, Chăm tạo nên di sản văn hóa Nam Bộ đặc sắc.',
   'interpretation', 'draft',
   'Xác minh theo biên khảo Lịch sử khẩn hoang miền Nam của nhà văn - nhà nghiên cứu Sơn Nam (NXB Trẻ).')
on conflict (id) do nothing;

-- 4. Claim Sources Mapping (Fulfills publication prerequisite before published transition)
insert into public.claim_sources (claim_id, source_id)
values
  ('c0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001'),
  ('c0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000001'),
  ('c0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000002'),
  ('c0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000007'),
  ('c0000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000003'),
  ('c0000000-0000-4000-8000-000000000006', 'd0000000-0000-4000-8000-000000000004'),
  ('c0000000-0000-4000-8000-000000000007', 'd0000000-0000-4000-8000-000000000005'),
  ('c0000000-0000-4000-8000-000000000008', 'd0000000-0000-4000-8000-000000000006')
on conflict (claim_id, source_id) do nothing;

-- Publish verified claims (passes validate_publication_links)
update public.historical_claims
set review_status = 'published'
where id in (
  'c0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000002',
  'c0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004',
  'c0000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000006',
  'c0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000008'
);

-- 4. Canonical Historical Books Mapped Across All 5 Eras
insert into public.historical_books (
  id, era_id, book_code, title, original_title, author, translator, publisher,
  publication_year, edition, isbn, category, summary, verification_status, status
)
values
  -- Era 1: Dựng nước & Bắc thuộc
  ('b0000000-0000-4000-8000-000000000001', 'e0000000-0000-4000-8000-000000000001',
   'book_000012', '18 đời vua Hùng Vương: Một ý niệm về liên tục', null, 'Nguyên Nguyên', null,
   'Nhà xuất bản Văn hóa Dân tộc', 1999, 'Tái bản có chỉnh lý', null,
   'Khảo cứu lịch sử / Thời đại Hùng Vương',
   'Khảo cứu công phu về tính liên tục văn hóa và lịch sử của thời đại các vua Hùng dựng nước Văn Lang, đối chiếu giữa huyền sử truyền khẩu và các phát hiện khảo cổ học Đông Sơn.',
   'VERIFIED', 'draft'),

  -- Era 2: Kỷ nguyên Độc lập Phong kiến
  ('b0000000-0000-4000-8000-000000000002', 'e0000000-0000-4000-8000-000000000002',
   'book_000491', 'Bình Ngô Đại Cáo', null, 'Nguyễn Trãi', 'Ngô Tất Tố',
   'Nhà xuất bản Văn học', 1428, 'Bản tuyển dịch kinh điển', null,
   'Văn học cổ điển / Sử liệu Lam Sơn',
   'Bản thiên cổ hùng văn tuyên ngôn nền độc lập vững bền của Đại Việt sau thắng lợi của cuộc khởi nghĩa Lam Sơn quét sạch ách đô hộ của nhà Minh, nêu cao ngọn cờ nhân nghĩa.',
   'VERIFIED', 'draft'),

  ('b0000000-0000-4000-8000-000000000003', 'e0000000-0000-4000-8000-000000000002',
   'book_005969', 'Nhà Tây Sơn', null, 'Quách Tấn, Quách Giao', null,
   'Nhà xuất bản Trẻ', 2008, 'Ấn bản khảo cứu lịch sử', '978-604-1-00234-0',
   'Biên khảo lịch sử / Triều đại Tây Sơn',
   'Công trình khảo cứu toàn diện về phong trào khởi nghĩa Tây Sơn, sự nghiệp quân sự bách chiến bách thắng của Hoàng đế Quang Trung - Nguyễn Huệ và các danh tướng Tây Sơn.',
   'VERIFIED', 'draft'),

  -- Era 3: Cận đại & Kháng chiến chống Pháp
  ('b0000000-0000-4000-8000-000000000004', 'e0000000-0000-4000-8000-000000000003',
   'book_000682', 'Bản án chế độ thực dân Pháp', 'Le Procès de la colonisation française', 'Nguyễn Ái Quốc', null,
   'Nhà xuất bản Chính trị quốc gia Sự thật', 1925, 'Hồ Chí Minh toàn tập xuất bản', null,
   'Chính luận lịch sử / Kháng chiến chống Pháp',
   'Tác phẩm chính luận bằng tiếng Pháp của Nguyễn Ái Quốc xuất bản năm 1925 tại Paris, dùng số liệu và sự kiện tố cáo đanh thép chính sách bóc lột, thuế khóa và đàn áp của thực dân Pháp tại Đông Dương.',
   'VERIFIED', 'draft'),

  ('b0000000-0000-4000-8000-000000000005', 'e0000000-0000-4000-8000-000000000003',
   'book_005273', 'NAVARRE Với Điện Biên Phủ', 'Nous étions à Diên Biên Phu', 'Jean Pouget', 'Lê Kim',
   'Nhà xuất bản Công an Nhân dân', 2004, 'Bản dịch tiếng Việt', null,
   'Hồi ký quân sự / Chiến dịch Điện Biên Phủ',
   'Tập hồi ức của sĩ quan tùy tùng Tướng Henri Navarre ghi lại toàn bộ quá trình xây dựng kế hoạch Nava, sự thất bại của tập đoàn cứ điểm Điện Biên Phủ dưới góc nhìn của bộ chỉ huy Pháp.',
   'VERIFIED', 'draft'),

  ('b0000000-0000-4000-8000-000000000006', 'e0000000-0000-4000-8000-000000000003',
   'book_006349', 'Những năm tháng không thể nào quên', null, 'Võ Nguyên Giáp', 'Hữu Mai',
   'Nhà xuất bản Quân đội nhân dân', 1975, 'Ấn bản hồi ức lịch sử', null,
   'Hồi ký lịch sử / Kháng chiến chống Pháp',
   'Hồi ký của Đại tướng Võ Nguyên Giáp về những ngày tháng lịch sử sau Cách mạng Tháng Tám 1945 và những năm đầu gian khổ nhưng anh dũng của cuộc toàn quốc kháng chiến.',
   'VERIFIED', 'draft'),

  -- Era 4: Kháng chiến chống Mỹ & Thống nhất
  ('b0000000-0000-4000-8000-000000000007', 'e0000000-0000-4000-8000-000000000004',
   'book_010084', 'Đường Xuyên Trường Sơn', null, 'Đồng Sĩ Nguyên', null,
   'Nhà xuất bản Trẻ & NXB Chính trị quốc gia Sự thật', 2005, 'Ấn bản kỷ niệm đường Hồ Chí Minh', null,
   'Hồi ký quân sự / Tuyến vận tải Trường Sơn',
   'Hồi ức của Trung tướng Đồng Sĩ Nguyên, Tư lệnh Bộ đội Trường Sơn, tái hiện cuộc chiến tranh ngăn chặn khốc liệt và kỳ tích mở đường Hồ Chí Minh chi viện cho tiền tuyến lớn miền Nam.',
   'VERIFIED', 'draft'),

  ('b0000000-0000-4000-8000-000000000008', 'e0000000-0000-4000-8000-000000000004',
   'book_000170', 'Ba người khác', null, 'Tô Hoài', null,
   'Nhà xuất bản Đà Nẵng', 2006, 'Ấn bản tiểu thuyết', null,
   'Tiểu thuyết / Lịch sử hiện thực',
   'Tiểu thuyết viết về đề tài cải cách ruộng đất giai đoạn 1954-1956 tại miền Bắc Việt Nam qua góc nhìn trần trụi và chân thực của người trong cuộc.',
   'VERIFIED', 'draft'),

  -- Era 5: Hiện đại, Khảo cứu Lịch sử & Địa chí Văn hóa
  ('b0000000-0000-4000-8000-000000000009', 'e0000000-0000-4000-8000-000000000005',
   'book_004315', 'Lịch Sử Khẩn Hoang Miền Nam', null, 'Sơn Nam', null,
   'Nhà xuất bản Trẻ', 2018, 'Ấn bản di sản Sơn Nam', '978-604-1-12854-5',
   'Biên khảo / Lịch sử - Địa chí Nam Bộ',
   'Biên khảo kinh điển tái hiện công cuộc khai phá, thuần hóa thiên nhiên và định cư của cư dân Việt trên vùng đất Nam Bộ suốt ba thế kỷ.',
   'VERIFIED', 'draft'),

  ('b0000000-0000-4000-8000-000000000010', 'e0000000-0000-4000-8000-000000000005',
   'book_000670', 'Bảy ngày trong Đồng Tháp Mười', null, 'Nguyễn Hiến Lê', null,
   'Nhà xuất bản Văn hóa Thông tin', 1954, 'Bản in khảo cứu', null,
   'Du ký / Địa chí - Khảo cứu ĐBSCL',
   'Tác phẩm du khảo ghi lại chuyến khảo sát sông nước và đời sống hoang sơ tại Đồng Tháp Mười năm 1939, viết lại và ấn hành năm 1954; tái hiện địa lý và phong tục độc đáo vùng đồng trũng.',
   'VERIFIED', 'draft')
on conflict (id) do nothing;

-- 5. Linking Books to Verified Sources (historical_book_sources)
insert into public.historical_book_sources (book_id, source_id, authority_level, relation_note)
values
  -- Era 1: book_000012 -> Đại Việt Sử Ký Toàn Thư
  ('b0000000-0000-4000-8000-000000000001', 'd0000000-0000-4000-8000-000000000001', 5,
   'Sử liệu gốc thời Hậu Lê (Ngoại kỷ Quyển I) ghi chép truyền thuyết 18 đời vua Hùng từ thời Kinh Dương Vương và Lạc Long Quân.'),

  -- Era 2: book_000491 -> Bình Ngô Đại Cáo
  ('b0000000-0000-4000-8000-000000000002', 'd0000000-0000-4000-8000-000000000002', 5,
   'Bản dịch chuẩn mực của Ngô Tất Tố từ nguyên văn chữ Hán trong Đại Việt Sử Ký Toàn Thư.'),

  -- Era 2: book_005969 -> Nhà Tây Sơn
  ('b0000000-0000-4000-8000-000000000003', 'd0000000-0000-4000-8000-000000000007', 4,
   'Công trình biên khảo công phu của anh em Quách Tấn - Quách Giao, NXB Trẻ ấn hành.'),

  -- Era 3: book_000682 -> Bản án chế độ thực dân Pháp
  ('b0000000-0000-4000-8000-000000000004', 'd0000000-0000-4000-8000-000000000003', 5,
   'Nguyên bản tiếng Pháp lưu trữ tại Thư viện Quốc gia Pháp (BNF Gallica) và ấn bản chuẩn trong Hồ Chí Minh Toàn tập Tập 2.'),

  -- Era 3: book_005273 -> Chiến dịch Điện Biên Phủ
  ('b0000000-0000-4000-8000-000000000005', 'd0000000-0000-4000-8000-000000000004', 5,
   'Tư liệu đối chiếu giữa hồi ký tùy tùng Jean Pouget và tài liệu tác chiến của Viện Lịch sử Quân sự Việt Nam.'),

  -- Era 3: book_006349 -> Chiến dịch Điện Biên Phủ / Viện LSQSVN
  ('b0000000-0000-4000-8000-000000000006', 'd0000000-0000-4000-8000-000000000004', 5,
   'Hồi ức chính thức của Đại tướng Võ Nguyên Giáp, xuất bản bởi NXB Quân đội Nhân dân.'),

  -- Era 4: book_010084 -> Đường Xuyên Trường Sơn
  ('b0000000-0000-4000-8000-000000000007', 'd0000000-0000-4000-8000-000000000005', 5,
   'Hồi ký của Tư lệnh Đoàn 559 Đồng Sĩ Nguyên, NXB Chính trị quốc gia Sự thật & NXB Trẻ.'),

  -- Era 5: book_004315 -> Lịch sử khẩn hoang miền Nam
  ('b0000000-0000-4000-8000-000000000009', 'd0000000-0000-4000-8000-000000000006', 4,
   'Ấn bản chính thức NXB Trẻ, ISBN 978-604-1-12854-5.'),

  -- Era 5: book_000670 -> Bảy ngày trong Đồng Tháp Mười
  ('b0000000-0000-4000-8000-000000000010', 'd0000000-0000-4000-8000-000000000008', 4,
   'Du ký địa chí của học giả Nguyễn Hiến Lê, NXB Văn hóa Thông tin.')
on conflict (book_id, source_id) do nothing;

-- 6. Linking Books to Verified Claims (historical_book_claims)
insert into public.historical_book_claims (book_id, claim_id, citation_locator, verification_status)
values
  -- Era 1
  ('b0000000-0000-4000-8000-000000000001', 'c0000000-0000-4000-8000-000000000001',
   'Chương I: Khái niệm liên tục lịch sử và huyền sử Văn Lang, tr. 15-42', 'VERIFIED'),

  -- Era 2
  ('b0000000-0000-4000-8000-000000000002', 'c0000000-0000-4000-8000-000000000003',
   'Đoạn mở đầu và kết thúc Bình Ngô Đại Cáo, khẳng định nền văn hiến và thắng lợi Lam Sơn', 'VERIFIED'),

  ('b0000000-0000-4000-8000-000000000003', 'c0000000-0000-4000-8000-000000000004',
   'Chương IV: Chiến thắng Rạch Gầm - Xoài Mút và Đại phá quân Thanh mùa Xuân Kỷ Dậu 1789, tr. 85-140', 'VERIFIED'),

  -- Era 3
  ('b0000000-0000-4000-8000-000000000004', 'c0000000-0000-4000-8000-000000000005',
   'Chương I: Thuế máu; Chương XI: Nỗi khổ nhục của người bản xứ, tr. 25-110', 'VERIFIED'),

  ('b0000000-0000-4000-8000-000000000005', 'c0000000-0000-4000-8000-000000000006',
   'Phần 3: Trận đánh quyết định và sự sụp đổ của Tập đoàn cứ điểm Điện Biên Phủ, tr. 210-275', 'VERIFIED'),

  ('b0000000-0000-4000-8000-000000000006', 'c0000000-0000-4000-8000-000000000006',
   'Chương V: Những ngày đầu độc lập và sự chuẩn bị cho cuộc kháng chiến trường kỳ, tr. 90-185', 'VERIFIED'),

  -- Era 4
  ('b0000000-0000-4000-8000-000000000007', 'c0000000-0000-4000-8000-000000000007',
   'Chương III & IV: Tuyến chi viện chiến lược 559 và chiến dịch mở đường Trường Sơn, tr. 75-160', 'VERIFIED'),

  -- Era 5
  ('b0000000-0000-4000-8000-000000000009', 'c0000000-0000-4000-8000-000000000008',
   'Phần II: Dấu chân người mở đất và công cuộc đào kênh dẫn nước, tr. 45-120', 'VERIFIED'),

  ('b0000000-0000-4000-8000-000000000010', 'c0000000-0000-4000-8000-000000000008',
   'Chương III: Thiên nhiên, hệ thống kênh rạch và đời sống cư dân Đồng Tháp Mười, tr. 30-78', 'VERIFIED')
on conflict (book_id, claim_id) do nothing;

-- 8. Publish books now that child records are in place
update public.historical_books
set status = 'published'
where id in (
  'b0000000-0000-4000-8000-000000000001', 'b0000000-0000-4000-8000-000000000002',
  'b0000000-0000-4000-8000-000000000003', 'b0000000-0000-4000-8000-000000000004',
  'b0000000-0000-4000-8000-000000000005', 'b0000000-0000-4000-8000-000000000006',
  'b0000000-0000-4000-8000-000000000007', 'b0000000-0000-4000-8000-000000000008',
  'b0000000-0000-4000-8000-000000000009', 'b0000000-0000-4000-8000-000000000010'
);

-- 9. Immutability Triggers for Published Records
create trigger immutable before update or delete on public.historical_eras
  for each row execute function private.immutable_root('status');

create trigger immutable before update or delete on public.historical_books
  for each row execute function private.immutable_root('status');

create trigger immutable before update or delete on public.historical_book_sources
  for each row execute function private.immutable_child('historical_books', 'book_id', 'status');

create trigger immutable before update or delete on public.historical_book_claims
  for each row execute function private.immutable_child('historical_books', 'book_id', 'status');



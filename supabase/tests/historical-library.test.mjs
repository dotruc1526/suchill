import test from 'node:test'
import assert from 'node:assert/strict'
import { createTestDatabase, asRole, ids, read } from './harness.mjs'

test('historical library: multi-era catalog, verified citations, RLS and trusted RPCs', async t => {
  const db = await createTestDatabase()

  const eraIds = {
    ancient: 'e0000000-0000-4000-8000-000000000001',
    independent: 'e0000000-0000-4000-8000-000000000002',
    colonial: 'e0000000-0000-4000-8000-000000000003',
    reunification: 'e0000000-0000-4000-8000-000000000004',
    contemporary: 'e0000000-0000-4000-8000-000000000005',
  }

  const bookIds = {
    hungVuong: 'b0000000-0000-4000-8000-000000000001',
    binhNgo: 'b0000000-0000-4000-8000-000000000002',
    taySon: 'b0000000-0000-4000-8000-000000000003',
    banAn: 'b0000000-0000-4000-8000-000000000004',
    navarre: 'b0000000-0000-4000-8000-000000000005',
    nhungNamThang: 'b0000000-0000-4000-8000-000000000006',
    truongSon: 'b0000000-0000-4000-8000-000000000007',
    toHoai: 'b0000000-0000-4000-8000-000000000008',
    sonNam: 'b0000000-0000-4000-8000-000000000009',
    dongThapMuoi: 'b0000000-0000-4000-8000-000000000010',
  }

  await t.test('1. All 5 canonical historical eras exist and cover Vietnamese history chronologically', async () => {
    const erasResult = await asRole(db, 'anon', null, async tx =>
      (await tx.query('select * from public.historical_eras order by order_index asc')).rows
    )
    assert.equal(erasResult.length, 5, 'Must have exactly 5 canonical eras')
    assert.deepEqual(
      erasResult.map(e => e.slug),
      ['dung-nuoc-bac-thuoc', 'doc-lap-phong-kien', 'can-dai-chong-phap', 'chong-my-thong-nhat', 'hien-dai-khao-cuu'],
      'Eras must be in chronological order'
    )
    for (const era of erasResult) {
      assert.equal(era.status, 'published')
      assert.ok(era.name && era.time_period && era.description, 'Era must have complete metadata')
    }
  })

  await t.test('2. Multi-era books are published and verified with citations across all eras', async () => {
    const books = await asRole(db, 'anon', null, async tx =>
      (await tx.query('select * from public.historical_books order by book_code asc')).rows
    )
    assert.equal(books.length, 10, 'Must have 10 representative books seeded')

    // Verify each era has representation
    const eraCounts = new Map()
    for (const b of books) {
      assert.equal(b.status, 'published')
      assert.equal(b.verification_status, 'VERIFIED')
      assert.ok(b.author, `Book ${b.book_code} must have an author`)
      assert.ok(b.title, `Book ${b.book_code} must have a title`)
      eraCounts.set(b.era_id, (eraCounts.get(b.era_id) || 0) + 1)
    }
    assert.equal(eraCounts.size, 5, 'All 5 eras must have books represented')
  })

  await t.test('3. Provenance integrity: books map to authoritative sources and verified claims with locators', async () => {
    // Check book_sources
    const bookSources = await asRole(db, 'anon', null, async tx =>
      (await tx.query(`
        select bs.*, s.title as source_title, s.tier, s.url
        from public.historical_book_sources bs
        join public.historical_sources s on s.id = bs.source_id
      `)).rows
    )
    assert.ok(bookSources.length >= 9, 'Seeded books must have source mappings')
    for (const bs of bookSources) {
      assert.ok(bs.authority_level >= 4, 'Sources must be Level 4 or Level 5')
      assert.ok(bs.relation_note, 'Relation note must explain source relationship')
      assert.ok(bs.source_title, 'Source must have title')
      assert.ok(bs.url.startsWith('https://'), 'Source URL must be valid HTTPS')
    }

    // Check book_claims
    const bookClaims = await asRole(db, 'anon', null, async tx =>
      (await tx.query(`
        select bc.*, c.statement, c.kind
        from public.historical_book_claims bc
        join public.historical_claims c on c.id = bc.claim_id
      `)).rows
    )
    assert.ok(bookClaims.length >= 9, 'Seeded books must have claim mappings')
    for (const bc of bookClaims) {
      assert.equal(bc.verification_status, 'VERIFIED')
      assert.ok(bc.citation_locator, 'Must have precise citation locator')
      assert.ok(bc.statement, 'Claim must have statement')
    }
  })

  await t.test('4. RLS Default-Deny: Anon and Authenticated users CANNOT mutate library records', async () => {
    // Anon cannot insert a fake era
    await asRole(db, 'anon', null, async tx => {
      await assert.rejects(
        tx.query("insert into public.historical_eras(slug, name, time_period, order_index, description) values('fake', 'Fake', '2026', 99, 'Fake')"),
        /permission denied/,
        'Anon must not insert historical eras'
      )
    })

    // Authenticated User A cannot insert a fake book
    await asRole(db, 'authenticated', ids.userA, async tx => {
      await assert.rejects(
        tx.query(`insert into public.historical_books(era_id, book_code, title, author) values('${eraIds.ancient}', 'book_fake', 'Fake', 'Fake')`),
        /permission denied/,
        'Authenticated user must not insert books directly'
      )
    })

    // Authenticated User A cannot mutate an existing book
    await asRole(db, 'authenticated', ids.userA, async tx => {
      await assert.rejects(
        tx.query(`update public.historical_books set title='Hacked' where id='${bookIds.hungVuong}'`),
        /permission denied/,
        'Authenticated user must not update books'
      )
    })

    // Authenticated User A cannot delete an existing book
    await asRole(db, 'authenticated', ids.userA, async tx => {
      await assert.rejects(
        tx.query(`delete from public.historical_books where id='${bookIds.hungVuong}'`),
        /permission denied/,
        'Authenticated user must not delete books'
      )
    })

    // Authenticated User A cannot inject sources or claims directly
    await asRole(db, 'authenticated', ids.userA, async tx => {
      await assert.rejects(
        tx.query(`insert into public.historical_book_sources(book_id, source_id) values('${bookIds.hungVuong}', 'd0000000-0000-4000-8000-000000000001')`),
        /permission denied/,
        'Authenticated user must not insert book sources'
      )
    })
  })

  await t.test('5. Immutability trigger rejects updates or deletions even under postgres/service role if published', async () => {
    await asRole(db, 'service_role', null, async tx => {
      await assert.rejects(
        tx.query(`update public.historical_books set title='Mutated' where id='${bookIds.binhNgo}'`),
        /Published content is immutable/,
        'Published books must be protected by immutability trigger'
      )
    })
    await asRole(db, 'service_role', null, async tx => {
      await assert.rejects(
        tx.query(`delete from public.historical_books where id='${bookIds.binhNgo}'`),
        /Published content is immutable/,
        'Published books must not be deleted'
      )
    })
  })

  await t.test('6. Public RPC get_historical_eras returns published eras with book counts', async () => {
    const erasJson = await asRole(db, 'anon', null, async tx =>
      (await tx.query('select public.get_historical_eras() as result')).rows[0].result
    )
    assert.equal(erasJson.length, 5)
    assert.equal(erasJson[0].slug, 'dung-nuoc-bac-thuoc')
    assert.ok(erasJson[0].bookCount >= 1)
    assert.equal(erasJson[1].slug, 'doc-lap-phong-kien')
    assert.ok(erasJson[1].bookCount >= 2)
  })

  await t.test('7. Public RPC search_historical_books supports keyword search and era filtering', async () => {
    // Search by era
    const eraFilter = await asRole(db, 'anon', null, async tx =>
      (await tx.query("select public.search_historical_books('doc-lap-phong-kien', null, 10, 0) as result")).rows[0].result
    )
    assert.equal(eraFilter.total, 2)
    assert.equal(eraFilter.books.length, 2)
    assert.ok(eraFilter.books.some(b => b.bookCode === 'book_000491'))
    assert.ok(eraFilter.books.some(b => b.bookCode === 'book_005969'))

    // Search by keyword "Điện Biên Phủ"
    const keywordSearch = await asRole(db, 'anon', null, async tx =>
      (await tx.query("select public.search_historical_books(null, 'Điện Biên Phủ', 10, 0) as result")).rows[0].result
    )
    assert.ok(keywordSearch.total >= 1)
    assert.ok(keywordSearch.books.some(b => b.bookCode === 'book_005273'))

    // Search by author "Sơn Nam"
    const authorSearch = await asRole(db, 'anon', null, async tx =>
      (await tx.query("select public.search_historical_books(null, 'Sơn Nam', 10, 0) as result")).rows[0].result
    )
    assert.equal(authorSearch.total, 1)
    assert.equal(authorSearch.books[0].bookCode, 'book_004315')
    assert.equal(authorSearch.books[0].author, 'Sơn Nam')
  })

  await t.test('8. Public RPC get_historical_book_detail returns full citations and claims', async () => {
    const bookDetail = await asRole(db, 'anon', null, async tx =>
      (await tx.query(`select public.get_historical_book_detail('${bookIds.sonNam}') as result`)).rows[0].result
    )
    assert.equal(bookDetail.title, 'Lịch Sử Khẩn Hoang Miền Nam')
    assert.equal(bookDetail.author, 'Sơn Nam')
    assert.equal(bookDetail.isbn, '978-604-1-12854-5')
    assert.equal(bookDetail.verificationStatus, 'VERIFIED')
    assert.ok(bookDetail.sources.length >= 1)
    assert.equal(bookDetail.sources[0].tier, 'scholarly')
    assert.ok(bookDetail.claims.length >= 1)
    assert.equal(bookDetail.claims[0].verificationStatus, 'VERIFIED')
    assert.ok(bookDetail.claims[0].citationLocator.includes('Phần II'))
  })

  await t.test('9. Extended learning_read handles eras, era, books, and book kinds', async () => {
    // Read eras
    const eras = await read(db, 'eras', null, null, null)
    assert.equal(eras.length, 5)

    // Read single era
    const singleEra = await read(db, 'era', eraIds.ancient, null, null)
    assert.equal(singleEra.slug, 'dung-nuoc-bac-thuoc')

    // Read single book
    const singleBook = await read(db, 'book', bookIds.binhNgo, null, null)
    assert.equal(singleBook.title, 'Bình Ngô Đại Cáo')
    assert.equal(singleBook.author, 'Nguyễn Trãi')

    // Read books filtered by era
    const eraBooks = await read(db, 'books', eraIds.reunification, null, null)
    assert.equal(eraBooks.length, 2)
  })

  await t.test('10. Draft isolation: Unpublished books or eras remain invisible to clients', async () => {
    const draftEraId = 'e0000000-0000-4000-8000-000000000099'
    const draftBookId = 'b0000000-0000-4000-8000-000000000099'

    // Insert draft items via postgres
    await db.exec(`
      insert into public.historical_eras (id, slug, name, time_period, order_index, description, status)
      values ('${draftEraId}', 'draft-era', 'Thời kỳ Draft', '2099', 99, 'Draft era description', 'draft');

      insert into public.historical_books (id, era_id, book_code, title, author, status)
      values ('${draftBookId}', '${draftEraId}', 'book_draft_99', 'Draft Book', 'Draft Author', 'draft');
    `)

    // Anon cannot see draft era in table
    const anonEras = await asRole(db, 'anon', null, async tx =>
      (await tx.query(`select * from public.historical_eras where id = '${draftEraId}'`)).rows
    )
    assert.equal(anonEras.length, 0, 'Draft era must not be visible to anon')

    // Authenticated User A cannot see draft book
    const userABooks = await asRole(db, 'authenticated', ids.userA, async tx =>
      (await tx.query(`select * from public.historical_books where id = '${draftBookId}'`)).rows
    )
    assert.equal(userABooks.length, 0, 'Draft book must not be visible to authenticated user')

    // get_historical_eras RPC does not include draft
    const rpcEras = await asRole(db, 'anon', null, async tx =>
      (await tx.query('select public.get_historical_eras() as result')).rows[0].result
    )
    assert.ok(!rpcEras.some(e => e.id === draftEraId), 'RPC get_historical_eras must filter out drafts')
  })
})

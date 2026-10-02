import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const defaultDirectory = fileURLToPath(new URL('../../../docs/content/chapter1954/', import.meta.url));
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);

/** Structural validation only: preparation-v1 cannot carry historical approval. */
export function validateRegisters(sourceRegister, claimRegister) {
  const errors = [];
  const fail = (path, message) => errors.push(`${path}: ${message}`);
  const list = (value, path) => {
    if (!Array.isArray(value) || value.length === 0) {
      fail(path, 'expected nonempty array');
      return [];
    }
    return value;
  };
  const strings = (value, path) => {
    const values = list(value, path);
    if (values.some((item) => !text(item))) fail(path, 'expected nonempty string entries');
    if (new Set(values).size !== values.length) fail(path, 'duplicate entries');
    return values.filter(text);
  };
  const index = (rows, path, key, valid) => {
    const result = new Map();
    rows.forEach((row, i) => {
      if (!record(row) || !valid(row[key])) {
        fail(`${path}[${i}]`, `invalid ${key}`);
      } else if (result.has(row[key])) {
        fail(`${path}[${i}]`, `duplicate ${key} ${row[key]}`);
      } else result.set(row[key], row);
    });
    return result;
  };
  for (const [name, root] of [['sources', sourceRegister], ['claims', claimRegister]]) {
    if (!record(root)) {
      fail(name, 'expected register object');
      continue;
    }
    if (root.version !== 'research-preparation-v1') fail(name, 'unsupported version');
    if (root.researchStatus !== 'REVIEW') fail(name, 'preparation must remain REVIEW');
    if (root.canonicalUseAllowed !== false) fail(name, 'canonical use forbidden for preparation');
    if (!text(root.taskId) || !text(root.asOf)) fail(name, 'missing taskId/asOf');
  }
  if (sourceRegister?.historicalReviewer !== null) fail('sources', 'historicalReviewer must be null');
  if (sourceRegister?.taskId !== claimRegister?.taskId) fail('registers', 'taskId mismatch');
  const sourceRows = list(sourceRegister?.sources, 'sources.sources');
  const claimRows = list(claimRegister?.claims, 'claims.claims');
  const episodeRows = list(claimRegister?.episodes, 'claims.episodes');
  const sources = index(sourceRows, 'sources.sources', 'id', (id) => text(id) && id.startsWith('SRC-1954-'));
  const claims = index(claimRows, 'claims.claims', 'id', (id) => text(id) && id.startsWith('CLM-1954-'));
  const episodes = index(episodeRows, 'claims.episodes', 'number', (n) => Number.isInteger(n) && n >= 1 && n <= 7);
  if (episodes.size !== 7) fail('claims.episodes', 'expected seven unique episodes (1–7)');
  const sourceLinks = new Map();
  const claimLinks = new Map();
  const episodeLinks = new Map();
  for (const [id, source] of sources) {
    for (const field of ['title', 'publisher', 'accessedDate', 'perspective', 'sourceType', 'language']) {
      if (!text(source[field])) fail(id, `missing ${field}`);
    }
    for (const field of ['author', 'publishedDate']) {
      if (source[field] !== null && !text(source[field])) fail(id, field + ' must be null or nonempty text');
    }
    try {
      const url = new URL(source.url);
      if (url.protocol !== 'https:' || url.username || url.password) throw new Error();
    } catch { fail(id, 'expected public HTTPS URL without credentials'); }
    if (![1, 2, 3, 4].includes(source.tier)) fail(id, 'invalid source tier');
    strings(source.locators, `${id}.locators`);
    sourceLinks.set(id, strings(source.supportsClaims, `${id}.supportsClaims`));
    if (source.reviewStatus !== 'needs_historical_review' || source.reviewer !== null) {
      fail(id, 'preparation source must await historical reviewer');
    }
    if (source.canonicalUseAllowed !== undefined && source.canonicalUseAllowed !== false) {
      fail(id, 'canonical use forbidden for preparation');
    }
  }
  for (const [id, claim] of claims) {
    for (const field of ['statementVi', 'locator', 'notesVi']) {
      if (!text(claim[field])) fail(id, `missing ${field}`);
    }
    if (!['supported_for_review', 'needs_review'].includes(claim.assessment)) fail(id, 'invalid assessment');
    if (!['verified_fact', 'educational_explanation', 'uncertain_or_contested'].includes(claim.proposedTruthClass)) {
      fail(id, 'invalid proposedTruthClass');
    }
    if (claim.truthClass !== null || claim.reviewer !== null || claim.confidence !== null
      || claim.reviewStatus !== 'needs_historical_review' || claim.canonicalUseAllowed !== false) {
      fail(id, 'preparation claim must remain unapproved and unavailable for canonical use');
    }
    claimLinks.set(id, strings(claim.sourceIds, `${id}.sourceIds`));
    if (!episodes.has(claim.episode)) fail(id, 'unknown episode');
    const idEpisode = /^CLM-1954-(\d{2})-\d{3}$/.exec(id);
    if (!idEpisode || Number(idEpisode[1]) !== claim.episode) fail(id, 'ID/episode mismatch');
  }
  for (const [number, episode] of episodes) {
    if (!text(episode.title)) fail(`episode ${number}`, 'missing title');
    for (const field of ['time', 'place', 'event']) {
      if (!text(episode.historicalScope?.[field])) fail(`episode ${number}`, `missing historicalScope.${field}`);
    }
    episodeLinks.set(number, strings(episode.claimIds, `episode ${number}.claimIds`));
  }
  for (const [id, links] of sourceLinks) {
    for (const claimId of links) {
      if (!claims.has(claimId)) fail(id, `unknown claim ${claimId}`);
      else if (!claimLinks.get(claimId)?.includes(id)) fail(id, `reverse binding missing for ${claimId}`);
    }
  }
  for (const [id, links] of claimLinks) {
    for (const sourceId of links) {
      if (!sources.has(sourceId)) fail(id, `unknown source ${sourceId}`);
      else if (!sourceLinks.get(sourceId)?.includes(id)) fail(id, `reverse binding missing for ${sourceId}`);
    }
    const episode = claims.get(id).episode;
    if (!episodeLinks.get(episode)?.includes(id)) fail(id, 'missing from episode claimIds');
  }
  for (const [number, links] of episodeLinks) {
    for (const id of links) {
      if (!claims.has(id)) fail(`episode ${number}`, `unknown claim ${id}`);
      else if (claims.get(id).episode !== number) fail(`episode ${number}`, `wrong episode for ${id}`);
    }
  }
  return { errors, counts: { sources: sources.size, claims: claims.size, episodes: episodes.size } };
}

export async function readRegisters(directory = defaultDirectory) {
  const load = async (name) => JSON.parse(await readFile(resolve(directory, name), 'utf8'));
  return Promise.all([load('SOURCE-REGISTER.json'), load('CLAIM-REGISTER.json')]);
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length > 1) throw new Error('Usage: node validate.mjs [register-directory]');
  const result = validateRegisters(...await readRegisters(args[0]));
  if (result.errors.length) {
    console.error(result.errors.join('\n'));
    process.exitCode = 1;
  } else console.log(`PASS: ${result.counts.sources} sources, ${result.counts.claims} claims, ${result.counts.episodes} episodes; structural preparation check only.`);
}

if (process.argv[1] && pathToFileURL(resolve(process.argv[1])).href === import.meta.url) {
  main().catch((error) => {
    console.error(`Register check failed: ${error.message}`);
    process.exitCode = 1;
  });
}

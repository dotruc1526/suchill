type ReadinessOptions = {
  signal: AbortSignal; onStatus?: (message: string) => void;
  timeoutMs?: number; pollMs?: number; fetcher?: typeof fetch;
};

function pause(ms: number, signal: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal.aborted) { reject(signal.reason); return; }
    const cancelled = () => { clearTimeout(timer); reject(signal.reason); };
    const timer = setTimeout(() => { signal.removeEventListener("abort", cancelled); resolve(); }, ms);
    signal.addEventListener("abort", cancelled, { once: true });
  });
}

// Free trial hosts may take about a minute to wake. Never fabricate a match
// while waiting, and cancel immediately when the feature/account unmounts.
export async function waitForGameServer(url: string, options: ReadinessOptions) {
  const deadline = Date.now() + (options.timeoutMs ?? 90000);
  const fetcher = options.fetcher ?? fetch;
  options.onStatus?.("Đang kết nối máy chủ Đấu Trí…");
  while (Date.now() < deadline) {
    options.signal.throwIfAborted();
    const request = new AbortController();
    const cancelled = () => request.abort(options.signal.reason);
    options.signal.addEventListener("abort", cancelled, { once: true });
    const timer = setTimeout(() => request.abort(), Math.min(5000, deadline - Date.now()));
    try {
      const response = await fetcher(`${url}/health`, { signal: request.signal, credentials: "omit", cache: "no-store" });
      if (response.ok && (await response.json()).status === "ok") return;
    } catch {
      options.signal.throwIfAborted();
    } finally {
      clearTimeout(timer);
      options.signal.removeEventListener("abort", cancelled);
    }
    options.onStatus?.("Máy chủ chưa sẵn sàng. Đang chờ khởi động hoặc kết nối lại…");
    await pause(Math.max(0, Math.min(options.pollMs ?? 2000, deadline - Date.now())), options.signal);
  }
  throw new Error("Máy chủ chưa sẵn sàng. Hãy kiểm tra kết nối và thử lại.");
}

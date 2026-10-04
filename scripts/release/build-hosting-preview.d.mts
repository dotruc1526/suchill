export function verifiedPackage(packageDir: string): Promise<{
  files: Map<string, Buffer>;
  metadata: { durationSeconds: number; videoSha256: string; sourceIds: string[] };
}>;

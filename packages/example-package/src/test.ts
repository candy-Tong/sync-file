export default function handler(targetDir: string) {
  return [
    {
      source: './files/test-file',
      target: targetDir,
    },
  ];
}

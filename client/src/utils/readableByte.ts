export default function readableByte(byte: number) {
  if (byte < 1000) return byte + "Bytes";
  if (byte < 1000_000) return (byte / 1024).toFixed(2) + "KB";
  if (byte < 1000_000_000) return (byte / Math.pow(1024, 2)).toFixed(2) + "MB";
  if (byte < 1000_000_000_000)
    return (byte / Math.pow(1024, 3)).toFixed(2) + "GB";
  return (byte / Math.pow(1024, 4)).toFixed(2) + "TB";
}

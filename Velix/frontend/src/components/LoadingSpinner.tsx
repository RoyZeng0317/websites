export default function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div
      className="border-2 border-dark-border border-t-velix-500 rounded-full animate-spin"
      style={{ width: size, height: size }}
    />
  )
}

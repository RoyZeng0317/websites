interface AvatarProps {
  src?: string
  name: string
  size?: number
  className?: string
}

export default function Avatar({ src, name, size = 40, className = '' }: AvatarProps) {
  const initial = (name || '?').charAt(0).toUpperCase()

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`rounded-full object-cover ${className}`}
        style={{ width: size, height: size, minWidth: size }}
        onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
      />
    )
  }

  return (
    <div
      className={`rounded-full bg-velix-700 flex items-center justify-center text-white font-bold select-none ${className}`}
      style={{ width: size, height: size, minWidth: size, fontSize: size * 0.4 }}
    >
      {initial}
    </div>
  )
}

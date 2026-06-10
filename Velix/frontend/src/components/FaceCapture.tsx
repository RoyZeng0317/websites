import { useEffect, useRef, useState } from 'react'
import { Camera, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

interface Props {
  onCapture: (file: File) => void
  onCancel?: () => void
}

type FaceStatus = 'initializing' | 'no-face' | 'face-ok' | 'captured' | 'error' | 'no-support'

export default function FaceCapture({ onCapture, onCancel }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectorRef = useRef<any>(null)
  const detectTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const [status, setStatus] = useState<FaceStatus>('initializing')
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [capturedFile, setCapturedFile] = useState<File | null>(null)
  const [cameraError, setCameraError] = useState('')

  useEffect(() => {
    startCamera()
    return () => stopCamera()
  }, [])

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      // Try to init FaceDetector (Chrome / Android native API)
      if ('FaceDetector' in window) {
        detectorRef.current = new (window as any).FaceDetector({ fastMode: true, maxDetectedFaces: 1 })
        setStatus('no-face')
        startDetectionLoop()
      } else {
        // Fallback: no native face detection, still allow selfie capture
        setStatus('no-support')
      }
    } catch (err: any) {
      setCameraError(err.name === 'NotAllowedError' ? '請允許相機存取權限' : '無法開啟相機')
      setStatus('error')
    }
  }

  function startDetectionLoop() {
    detectTimerRef.current = setInterval(async () => {
      if (!videoRef.current || !detectorRef.current) return
      if (videoRef.current.readyState < 2) return
      try {
        const faces = await detectorRef.current.detect(videoRef.current)
        setStatus(faces.length > 0 ? 'face-ok' : 'no-face')
      } catch {
        setStatus('no-face')
      }
    }, 400)
  }

  function stopCamera() {
    if (detectTimerRef.current) clearInterval(detectTimerRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
  }

  function capturePhoto() {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')!
    // Mirror horizontally (front camera)
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)

    canvas.toBlob(blob => {
      if (!blob) return
      const file = new File([blob], `selfie-${Date.now()}.jpg`, { type: 'image/jpeg' })
      const url = URL.createObjectURL(blob)
      setPreviewUrl(url)
      setCapturedFile(file)
      setStatus('captured')
      stopCamera()
    }, 'image/jpeg', 0.92)
  }

  function retake() {
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setCapturedFile(null)
    setStatus('initializing')
    startCamera()
  }

  function confirm() {
    if (capturedFile) onCapture(capturedFile)
  }

  // ── Captured preview ──────────────────────────────────────────────────────
  if (status === 'captured' && previewUrl) {
    return (
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden border-4 border-green-500 shadow-lg shadow-green-900/30">
          <img src={previewUrl} alt="selfie" className="w-full h-full object-cover scale-x-[-1]" />
        </div>
        <p className="text-sm text-green-400 flex items-center gap-1.5">
          <CheckCircle size={16} /> 拍攝完成，請確認照片清晰
        </p>
        <div className="flex gap-3 w-full max-w-xs">
          <button onClick={retake} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dark-border text-sm text-dark-muted hover:text-dark-text transition-colors">
            <RefreshCw size={15} /> 重拍
          </button>
          <button onClick={confirm} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-velix-600 hover:bg-velix-500 text-white text-sm font-semibold transition-colors">
            <CheckCircle size={15} /> 使用此照片
          </button>
        </div>
      </div>
    )
  }

  // ── Camera error ──────────────────────────────────────────────────────────
  if (status === 'error') {
    return (
      <div className="flex flex-col items-center gap-4 py-6">
        <AlertCircle size={40} className="text-red-400" />
        <p className="text-sm text-red-400 text-center">{cameraError}</p>
        {onCancel && (
          <button onClick={onCancel} className="text-sm text-dark-muted hover:text-dark-text">
            返回
          </button>
        )}
      </div>
    )
  }

  // ── Ring colour based on face status ──────────────────────────────────────
  const ringClass =
    status === 'face-ok'
      ? 'border-green-500 shadow-green-900/30'
      : status === 'no-support'
      ? 'border-velix-500 shadow-velix-900/30'
      : 'border-dark-border'

  const canCapture = status === 'face-ok' || status === 'no-support'

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Video frame */}
      <div className={`relative w-full max-w-xs aspect-square rounded-2xl overflow-hidden border-4 ${ringClass} shadow-lg transition-colors duration-300`}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover scale-x-[-1]"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Face guide overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`w-44 h-56 rounded-[50%] border-2 border-dashed transition-colors duration-300 ${
            status === 'face-ok' ? 'border-green-400/70' : 'border-white/30'
          }`} />
        </div>

        {status === 'initializing' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <LoadingSpinner size={28} />
          </div>
        )}
      </div>

      {/* Status message */}
      {status === 'face-ok' && (
        <p className="text-sm text-green-400 flex items-center gap-1.5">
          <CheckCircle size={15} /> 偵測到人臉，可以拍照
        </p>
      )}
      {status === 'no-face' && (
        <p className="text-sm text-dark-muted flex items-center gap-1.5">
          <Camera size={15} /> 請將臉部對準橢圓框內
        </p>
      )}
      {status === 'no-support' && (
        <p className="text-sm text-velix-400 flex items-center gap-1.5">
          <Camera size={15} /> 請確保臉部清晰在鏡頭內
        </p>
      )}

      {/* Rules reminder */}
      <div className="flex items-start gap-2 bg-yellow-900/20 border border-yellow-800/40 rounded-xl px-3 py-2.5 w-full max-w-xs">
        <span className="text-yellow-400 text-base leading-none mt-0.5">⚠️</span>
        <p className="text-xs text-yellow-300/90 leading-relaxed">
          拍攝時請確保光線均勻，<strong>務必衣著端整</strong>，勿裸上身拍攝，否則予以退回。
        </p>
      </div>

      {/* Capture button */}
      <button
        onClick={capturePhoto}
        disabled={!canCapture}
        className="w-16 h-16 rounded-full bg-white disabled:bg-dark-border transition-colors flex items-center justify-center shadow-lg disabled:shadow-none"
        title="拍照"
      >
        <div className={`w-12 h-12 rounded-full transition-colors ${canCapture ? 'bg-velix-600' : 'bg-dark-surface'}`} />
      </button>

      {onCancel && (
        <button onClick={() => { stopCamera(); onCancel() }} className="text-sm text-dark-muted hover:text-dark-text transition-colors">
          取消
        </button>
      )}
    </div>
  )
}

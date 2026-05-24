import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error, info: { componentStack?: string }) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        this.props.fallback || (
          <div className="rounded-2xl border border-rose-500/25 bg-rose-500/10 px-4 py-4 text-sm text-rose-200">
            此區塊載入失敗，請重新整理頁面。
          </div>
        )
      )
    }

    return this.props.children
  }
}

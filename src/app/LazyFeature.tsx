import { Component, Suspense, lazy, useMemo, useState, type ComponentType, type ComponentProps, type ReactNode } from 'react'
import { Button, ErrorState, LoadingState } from '../components/ui'
import { pwaController } from '../services/pwa/controller'

type BoundaryProps = { children: ReactNode; onRetry: () => void; onBack?: () => void }
class LazyBoundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { pwaController.markReloadNeeded() }
  render() {
    if (!this.state.failed) return this.props.children
    return <section aria-label="Chưa tải được màn hình" className="space-y-3 p-4">
      <ErrorState title="Chưa tải được màn hình"
        message="Kết nối có thể đang gián đoạn. Tiến độ đã lưu vẫn được giữ nguyên. Nếu thử lại vẫn lỗi, hãy quay về Học để tải lại ứng dụng khi có mạng."
        onRetry={this.props.onRetry} />
      {this.props.onBack && <Button variant="outline" className="w-full" onClick={this.props.onBack}>QUAY LẠI</Button>}
    </section>
  }
}

/** Create at module scope. Only an explicit retry replaces a failed lazy component. */
export function lazyFeature<Feature extends ComponentType<any>>(
  loader: () => Promise<{ default: Feature }>,
  options: { onBack?: (props: ComponentProps<Feature>) => void } = {},
): ComponentType<ComponentProps<Feature>> {
  return function DeferredFeature(props: ComponentProps<Feature>) {
    const [attempt, setAttempt] = useState(0)
    const Deferred = useMemo(() => lazy(loader), [attempt]) as ComponentType<ComponentProps<Feature>>
    return <LazyBoundary key={attempt} onRetry={() => setAttempt(value => value + 1)}
      onBack={options.onBack ? () => options.onBack?.(props) : undefined}>
      <Suspense fallback={<LoadingState message="Đang tải màn hình…" />}><Deferred {...props} /></Suspense>
    </LazyBoundary>
  }
}


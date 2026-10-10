import { FiArrowLeft } from 'react-icons/fi';
import { Button } from '../components/ui';

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-[70vh] items-center justify-center px-4">
      <div className="pointer-events-none absolute inset-0 grid-bg" aria-hidden="true" />
      <div className="relative text-center">
        <p className="font-mono text-sm text-brand-400">404</p>
        <h1 className="mt-3 text-4xl font-semibold sm:text-5xl">Page not found</h1>
        <p className="mx-auto mt-3 max-w-sm text-ink-300">The page you're looking for doesn't exist or has moved.</p>
        <div className="mt-8 flex justify-center gap-3">
          <Button to="/"><FiArrowLeft className="h-4 w-4" /> Back to home</Button>
          <Button to="/post-performance" variant="secondary">Open the predictor</Button>
        </div>
      </div>
    </main>
  );
}

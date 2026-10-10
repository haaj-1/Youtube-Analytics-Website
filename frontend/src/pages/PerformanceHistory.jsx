import PerformanceHistory from '../components/tools/PerformanceHistory/PerformanceHistory';
import { PageHeader } from '../components/ui';

const PerformanceHistoryPage = () => (
  <>
    <PageHeader
      eyebrow="Channel intelligence"
      title="Channel Analytics"
      description="Posting patterns, length sweet spots and title keywords from any channel's 100 most recent uploads."
    />
    <PerformanceHistory />
  </>
);

export default PerformanceHistoryPage;

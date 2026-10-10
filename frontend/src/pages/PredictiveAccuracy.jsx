import AccuracyDashboard from '../components/tools/AccuracyDashboard/AccuracyDashboard';
import { PageHeader } from '../components/ui';

const PredictiveAccuracyPage = () => (
  <>
    <PageHeader
      eyebrow="Model card"
      title="Model Transparency"
      description="How the ensemble works, how accurate it is, and where it falls short — fully documented."
    />
    <AccuracyDashboard />
  </>
);

export default PredictiveAccuracyPage;

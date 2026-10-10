import PostPredictor from '../components/tools/PostPredictor/PostPredictor';
import { PageHeader } from '../components/ui';

const PostPerformancePage = () => (
  <>
    <PageHeader
      eyebrow="Pre-publish forecast"
      title="Performance Predictor"
      description="Estimate views before you upload, see which factors drive the number, and test better titles — all from one form."
    />
    <PostPredictor />
  </>
);

export default PostPerformancePage;

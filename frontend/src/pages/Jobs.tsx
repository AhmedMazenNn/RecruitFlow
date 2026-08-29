import { PageHeader } from '../components/layout/PageHeader';
import { ComingSoon } from '../components/ui/ComingSoon';

export function Jobs() {
  return (
    <div className="pb-10">
      <PageHeader
        title="Jobs"
        description="Every requisition in Northwind Labs, with live pipeline volume."
      />

      <div className="px-4 pt-5 lg:px-7">
        <ComingSoon />
      </div>
    </div>
  );
}

import { PageHeader } from '../components/layout/PageHeader';
import { ComingSoon } from '../components/ui/ComingSoon';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.first_name || 'there';

  return (
    <div className="pb-10">
      <PageHeader
        title={`Good morning, ${firstName}`}
        description="Friday, 28 August 2026 · 9 interviews and 3 offers are in flight this week."
      />

      <div className="px-4 pt-5 lg:px-7">
        <ComingSoon />
      </div>
    </div>
  );
}

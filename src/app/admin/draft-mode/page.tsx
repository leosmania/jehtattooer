import { Metadata } from 'next';
import DraftModePanel from './DraftModePanel';

export const metadata: Metadata = {
  title: 'Painel Draft Mode',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DraftModePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #081c15 0%, #0d2f21 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1rem',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      color: '#fff',
    }}>
      <DraftModePanel />
    </div>
  );
}

import { Studio } from './Studio';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'JehTattooer Admin Studio',
};

export default function StudioPage() {
  return <Studio />;
}

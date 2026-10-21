import { Workflow, LayoutDashboard, ShieldCheck, Globe } from 'lucide-react';
import type { ServiceIcon as ServiceIconName } from '@/content/services';

const map = {
  workflow: Workflow,
  system: LayoutDashboard,
  support: ShieldCheck,
  web: Globe,
} as const;

export function ServiceIcon({ name, size = 22 }: { name: ServiceIconName; size?: number }) {
  const Icon = map[name];
  return <Icon size={size} strokeWidth={1.6} aria-hidden />;
}

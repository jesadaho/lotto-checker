'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

export default function Navigation() {
  const router = useRouter();
  const pathname = usePathname();

  const items: MenuItem[] = [
    {
      label: 'Input',
      icon: 'pi pi-pencil',
      command: () => router.push('/')
    },
    {
      label: 'Summary',
      icon: 'pi pi-chart-bar',
      command: () => router.push('/summary')
    },
    {
      label: 'Admin',
      icon: 'pi pi-cog',
      command: () => router.push('/admin')
    }
  ];

  const start = (
    <div className="flex items-center gap-2">
      <i className="pi pi-ticket text-2xl text-primary"></i>
      <span className="text-xl font-semibold text-gray-900">Lotto Checker</span>
    </div>
  );

  return (
    <Menubar 
      model={items} 
      start={start}
      className="border-0 border-b-1 border-gray-200 rounded-none"
    />
  );
}

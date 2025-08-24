import { Logo } from './Logo';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';
import { ThemeSwitcher } from '../theme-switcher';

export default function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center gap-2">
        <Logo />
      </div>
      <nav className="space-x-3 flex items-center text-sm">
        <ThemeSwitcher />
        <Link href="/login" className={cn(buttonVariants({ variant: 'default', }))}>Sign in</Link>
      </nav>
    </header>
  );
}

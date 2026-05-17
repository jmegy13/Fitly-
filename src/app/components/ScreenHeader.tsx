import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { useNavigate } from 'react-router';

type ScreenHeaderProps = {
  title: string;
  backTo?: string;
  action?: ReactNode;
};

export function ScreenHeader({ title, backTo, action }: ScreenHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="px-6 pb-5 pt-12">
      <div className="mx-auto flex max-w-md items-center justify-between">
        {backTo ? (
          <button
            onClick={() => navigate(backTo)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
            type="button"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : (
          <div className="h-10 w-10" />
        )}
        <h1 className="text-lg font-semibold tracking-normal">{title}</h1>
        <div className="flex h-10 w-10 items-center justify-center">{action}</div>
      </div>
    </header>
  );
}

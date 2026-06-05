interface PageHeaderProps {
  title: string;
  description: string;
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <div className="page-header min-w-0">
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{title}</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-zinc-400 sm:mt-2 sm:text-base">{description}</p>
    </div>
  );
}

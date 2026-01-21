import { cn } from '@/lib/utils';

export default function HeadingSmall({
    title,
    description,
    className,
}: {
    title: string;
    description?: string;
    className?: string;
}) {
    return (
        <header className={cn(className)}>
            <h3 className="mb-0.5 text-base font-medium">{title}</h3>
            {description && (
                <p className="text-sm text-muted-foreground">{description}</p>
            )}
        </header>
    );
}

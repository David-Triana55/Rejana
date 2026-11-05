type ProgressProps = {
    step: number;
    total?: number;
};

export function Progress({ step, total = 3 }: ProgressProps) {
    return (
        <div className="flex items-center gap-2">
            {Array.from({ length: total }, (_, i) => (
                <span
                    key={i}
                    className={step >= i + 1 ? "h-1 flex-1 rounded-full bg-ink" : "h-1 flex-1 rounded-full bg-ink/20"}
                />
            ))}
            <span className="text-xs text-ink-soft">{step}/{total}</span>
        </div>
    );
}

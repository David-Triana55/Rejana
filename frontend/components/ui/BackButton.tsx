type BackButtonProps = {
    onClick: () => void;
    label?: string;
};

export function BackButton({ onClick, label = "Atrás" }: BackButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            aria-label={label}
            className="absolute left-4 top-4 grid size-9 cursor-pointer place-items-center rounded-full border-2 border-ink bg-white text-ink shadow-sticker-sm transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none"
        >
            <span aria-hidden>←</span>
        </button>
    );
}

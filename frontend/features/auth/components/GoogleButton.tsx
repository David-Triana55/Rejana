import Image from "next/image";

type GoogleButtonProps = {
  onClick: () => void;
};

export function GoogleButton({ onClick }: GoogleButtonProps) {
  return (
    <button type="button" onClick={onClick} aria-label="Continuar con Google" className="grid size-12 cursor-pointer place-items-center rounded-full border-2 border-tinta bg-white text-tinta shadow-sticker-sm transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none">
      <Image src="/google.svg" alt="" width={20} height={20} />
    </button>
  );
}

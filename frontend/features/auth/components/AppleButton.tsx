import Image from "next/image";

type AppleButtonProps = {
  onClick: () => void;
};

export function AppleButton({ onClick }: AppleButtonProps) {
  return (
    <button type="button" onClick={onClick} aria-label="Continuar con Apple" className="grid size-12 cursor-pointer place-items-center rounded-full border-2 border-tinta bg-tinta text-white shadow-sticker-sm transition hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none">
      <Image src="/apple.svg" alt="" width={20} height={20} />
    </button>
  );
}

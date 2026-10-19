import { Bombillas } from "@/components/ui/Bombillas";
import { Estrellas } from "@/components/ui/Estrellas";
import { Guirnalda } from "@/components/ui/Guirnalda";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-linear-to-b from-noche-950 via-noche-900 to-noche-800">
      <Estrellas />
      <Guirnalda />
      <Bombillas />
      {children}
    </div>
  );
}

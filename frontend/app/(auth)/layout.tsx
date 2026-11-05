import { Lights } from "@/components/ui/Lights";
import { Stars } from "@/components/ui/Stars";
import { Garland } from "@/components/ui/Garland";


export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative isolate min-h-dvh overflow-hidden bg-linear-to-b from-night-950 via-night-900 to-night-800">
      <Stars />
      <Garland />
      <Lights />
      {children}
    </div>
  );
}

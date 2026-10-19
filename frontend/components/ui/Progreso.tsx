type ProgresoProps = {
    paso: number;
  };
  
export function Progreso({paso}:ProgresoProps) {
    return (
        <div className="flex items-center gap-2">
            <span className="h-1 flex-1 rounded-full bg-tinta" />
            <span className={paso >= 2 ? "h-1 flex-1 rounded-full bg-tinta" : "h-1 flex-1 rounded-full bg-tinta/20"} />
            <span className={paso >= 3 ? "h-1 flex-1 rounded-full bg-tinta" : "h-1 flex-1 rounded-full bg-tinta/20"} />
            <span className="text-xs text-tinta-soft">{paso}/3</span>
        </div>
    )
}
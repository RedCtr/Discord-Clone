import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ActionTooltipType = {
  children: React.ReactNode;
  label: string;
  align?: "start" | "center" | "end";
  side: "top" | "right" | "left" | "bottom";
};
export default function ActionTooltip({
  children,
  label,
  align = "center",
  side,
}: ActionTooltipType) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="capitalize text-sm font-semibold">
            {label.toLocaleLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

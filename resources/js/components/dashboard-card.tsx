import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardCard({ children, className, animation, delay = 0 }: any) {
    return (
        <Card className={cn("overflow-hidden transition-all duration-300", className)}>
            {children}
        </Card>
    );
}
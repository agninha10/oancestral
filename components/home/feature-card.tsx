import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
    icon: LucideIcon;
    title: string;
    description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
    return (
        <Card className="group relative overflow-hidden border-border/50 bg-card/50 backdrop-blur transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
            <CardContent className="p-6 space-y-4">
                {/* Icon */}
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform group-hover:scale-110">
                    <Icon className="h-6 w-6" />
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg">{title}</h3>

                {/* Description */}
                <p className="text-sm text-muted-foreground leading-relaxed">
                    {description}
                </p>

                {/* Hover Gradient Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            </CardContent>
        </Card>
    );
}

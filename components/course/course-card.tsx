'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lock, PlayCircle } from 'lucide-react';

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    coverImage: string | null;
    isPremium: boolean;
    progress?: number;
}

interface CourseCardProps {
    course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
    return (
        <Link href={`/cursos/${course.slug}`}>
            <Card className="group h-full overflow-hidden transition-all hover:shadow-lg hover:border-primary/50">
                {/* Cover Image */}
                <div className="relative aspect-video overflow-hidden bg-muted">
                    {course.coverImage ? (
                        <Image
                            src={course.coverImage}
                            alt={course.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-full items-center justify-center">
                            <PlayCircle className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                    )}
                    
                    {/* Premium Badge */}
                    {course.isPremium && (
                        <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
                                <Lock className="mr-1 h-3 w-3" />
                                Premium
                            </Badge>
                        </div>
                    )}
                </div>

                <CardHeader className="space-y-2">
                    <h3 className="font-serif text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                    </h3>
                </CardHeader>

                <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                        {course.description}
                    </p>
                </CardContent>

                {/* Progress Bar */}
                {typeof course.progress !== 'undefined' && course.progress > 0 && (
                    <CardFooter className="pt-0">
                        <div className="w-full space-y-1">
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Progresso</span>
                                <span>{Math.round(course.progress)}%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                                <div
                                    className="h-full bg-primary transition-all"
                                    style={{ width: `${course.progress}%` }}
                                />
                            </div>
                        </div>
                    </CardFooter>
                )}
            </Card>
        </Link>
    );
}

export function PostCardSkeleton() {
    return (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-4 animate-pulse">
            <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-700" />
                <div className="space-y-1.5">
                    <div className="h-3 w-24 rounded bg-zinc-700" />
                    <div className="h-2.5 w-16 rounded bg-zinc-800" />
                </div>
                <div className="ml-auto h-5 w-16 rounded-full bg-zinc-800" />
            </div>
            <div className="space-y-2">
                <div className="h-5 w-3/4 rounded bg-zinc-700" />
                <div className="h-3.5 w-full rounded bg-zinc-800" />
                <div className="h-3.5 w-5/6 rounded bg-zinc-800" />
            </div>
            <div className="flex gap-4">
                <div className="h-4 w-12 rounded bg-zinc-800" />
                <div className="h-4 w-12 rounded bg-zinc-800" />
            </div>
        </div>
    );
}

export function PostFeedSkeleton() {
    return (
        <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
                <PostCardSkeleton key={i} />
            ))}
        </div>
    );
}

export function PostDetailSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6 space-y-5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-zinc-700" />
                    <div className="space-y-1.5">
                        <div className="h-3.5 w-28 rounded bg-zinc-700" />
                        <div className="h-3 w-20 rounded bg-zinc-800" />
                    </div>
                </div>
                <div className="h-7 w-2/3 rounded bg-zinc-700" />
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className={`h-3.5 rounded bg-zinc-800 ${i === 5 ? 'w-1/2' : 'w-full'}`} />
                    ))}
                </div>
            </div>
            <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 space-y-3 animate-pulse">
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-zinc-700" />
                            <div className="h-3 w-24 rounded bg-zinc-700" />
                        </div>
                        <div className="h-3.5 w-full rounded bg-zinc-800" />
                        <div className="h-3.5 w-4/5 rounded bg-zinc-800" />
                    </div>
                ))}
            </div>
        </div>
    );
}

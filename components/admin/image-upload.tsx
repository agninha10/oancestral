'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
    value?: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
    className?: string;
}

export function ImageUpload({ value, onChange, onRemove, className }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleUpload = useCallback(
        async (file: File) => {
            if (!file.type.startsWith('image/')) {
                alert('Por favor, selecione apenas arquivos de imagem');
                return;
            }

            setUploading(true);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    throw new Error('Erro ao fazer upload');
                }

                const data = await response.json();
                onChange(data.url);
            } catch (error) {
                console.error('Upload error:', error);
                alert('Erro ao fazer upload da imagem. Tente novamente.');
            } finally {
                setUploading(false);
            }
        },
        [onChange]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleUpload(e.dataTransfer.files[0]);
            }
        },
        [handleUpload]
    );

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
    }, []);

    const handleFileInput = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
                handleUpload(e.target.files[0]);
            }
        },
        [handleUpload]
    );

    if (value) {
        return (
            <div className={cn('relative group', className)}>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                    <Image
                        src={value}
                        alt="Upload preview"
                        fill
                        className="object-cover"
                    />
                </div>
                {onRemove && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={onRemove}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                )}
            </div>
        );
    }

    return (
        <div className={className}>
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                className={cn(
                    'relative border-2 border-dashed rounded-lg p-8 transition-colors',
                    dragActive
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-border hover:border-foreground/50',
                    uploading && 'opacity-50 pointer-events-none'
                )}
            >
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileInput}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    disabled={uploading}
                />

                <div className="flex flex-col items-center justify-center gap-4 text-center">
                    {uploading ? (
                        <>
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500" />
                            <p className="text-sm text-muted-foreground">Fazendo upload...</p>
                        </>
                    ) : (
                        <>
                            <div className="rounded-full bg-muted p-4">
                                <ImageIcon className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-foreground">
                                    Arraste uma imagem ou clique para selecionar
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PNG, JPG, GIF até 10MB
                                </p>
                            </div>
                            <Button type="button" variant="outline" size="sm">
                                <Upload className="h-4 w-4 mr-2" />
                                Selecionar Arquivo
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

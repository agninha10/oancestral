"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTransition } from "react";
import { updateUser } from "@/app/admin/usuarios/actions";
import { useRouter } from "next/navigation";
import { Role, SubscriptionStatus } from "@prisma/client";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "O nome deve ter pelo menos 2 caracteres.",
    }),
    role: z.nativeEnum(Role),
    subscriptionStatus: z.nativeEnum(SubscriptionStatus),
});

interface UserFormProps {
    user: {
        id: string;
        name: string;
        email: string;
        role: Role;
        subscriptionStatus: SubscriptionStatus;
    };
}

export function UserForm({ user }: UserFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: user.name,
            role: user.role,
            subscriptionStatus: user.subscriptionStatus,
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        startTransition(async () => {
            const result = await updateUser(user.id, values);

            if (result.success) {
                // In a real app we'd use toast here
                alert("Usuário atualizado com sucesso!");
                router.push("/admin/usuarios");
                router.refresh();
            } else {
                alert("Erro ao atualizar: " + result.error);
            }
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-lg">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                                <Input placeholder="Nome do usuário" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input value={user.email} disabled className="bg-muted" />
                    </FormControl>
                    <FormDescription>
                        O email não pode ser alterado.
                    </FormDescription>
                </FormItem>

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Função (Role)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma função" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={Role.USER}>Usuário</SelectItem>
                                    <SelectItem value={Role.ADMIN}>Administrador</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="subscriptionStatus"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status da Assinatura</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value={SubscriptionStatus.FREE}>Gratuito (Free)</SelectItem>
                                    <SelectItem value={SubscriptionStatus.ACTIVE}>Ativo (Premium)</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="flex justify-end gap-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancelar
                    </Button>
                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

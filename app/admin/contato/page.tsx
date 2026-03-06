import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Mail, MailOpen, MessageSquare } from "lucide-react";
import { MarkReadButton, DeleteButton } from "./actions-client";

export const dynamic = "force-dynamic";

async function getMessages() {
  return prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export default async function AdminContatoPage() {
  const messages = await getMessages();
  const unread = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Mensagens de Contato</h1>
          <p className="text-muted-foreground mt-1">
            {messages.length} mensagem{messages.length !== 1 ? "s" : ""} •{" "}
            <span className={unread > 0 ? "text-amber-500 font-medium" : "text-muted-foreground"}>
              {unread} não lida{unread !== 1 ? "s" : ""}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-border">
          <MessageSquare className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-semibold">{messages.length}</span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center gap-3 rounded-2xl border border-dashed border-border bg-card/40">
          <Mail className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">Nenhuma mensagem recebida ainda.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`group relative rounded-2xl border p-5 transition-all ${
                msg.read
                  ? "bg-card/40 border-border/50"
                  : "bg-card border-amber-500/25 shadow-sm shadow-amber-500/5"
              }`}
            >
              {/* Indicador de não lido */}
              {!msg.read && (
                <div className="absolute top-5 left-0 w-1 h-6 rounded-r-full bg-amber-500" />
              )}

              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-sm font-bold ${
                    msg.read
                      ? "bg-muted text-muted-foreground"
                      : "bg-amber-500/15 text-amber-500"
                  }`}
                >
                  {msg.name.charAt(0).toUpperCase()}
                </div>

                {/* Conteúdo */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{msg.name}</span>
                    <span className="text-muted-foreground text-sm">{msg.email}</span>
                    {!msg.read && (
                      <Badge className="bg-amber-500/15 text-amber-600 border-amber-500/20 text-[10px] px-1.5 py-0">
                        Nova
                      </Badge>
                    )}
                  </div>

                  <p className="text-sm font-medium text-foreground/80 mb-2">
                    {msg.subject}
                  </p>

                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                    {msg.message}
                  </p>

                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(msg.createdAt), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
                    </span>
                    <div className="flex items-center gap-2 ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      {!msg.read && <MarkReadButton id={msg.id} />}
                      <DeleteButton id={msg.id} />
                    </div>
                  </div>
                </div>

                {/* Ícone lida/não lida */}
                <div className="flex-shrink-0 self-start hidden sm:block">
                  {msg.read ? (
                    <MailOpen className="h-4 w-4 text-muted-foreground/40" />
                  ) : (
                    <Mail className="h-4 w-4 text-amber-500" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

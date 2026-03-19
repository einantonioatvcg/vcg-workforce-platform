'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, Sparkles, ChevronRight, User, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { askAgent } from '@/app/actions/chat'

export function AICommandCenter() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState<{role: 'user' | 'agent', text: string}[]>([
    { role: 'agent', text: 'Hola! Soy tu Agente Analista. Estoy conectado a la base de datos maestra de workforce. ¿Qué te gustaría saber hoy?' }
  ])
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const handleSubmit = async (e?: React.FormEvent, overrideInput?: string) => {
    e?.preventDefault()
    const userMsg = overrideInput || input
    if (!userMsg.trim() || loading) return

    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: userMsg }])
    setLoading(true)

    try {
      // Invocamos a Gemini y a BigQuery a través del Server Action
      const res = await askAgent(userMsg, messages)
      setMessages(prev => [...prev, { role: 'agent', text: res.text }])
    } catch (err) {
      setMessages(prev => [...prev, { role: 'agent', text: 'Ups, perdí conexión con el analizador cognitivo. Por favor intenta de nuevo.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:bg-primary/90 transition-transform active:scale-95 group z-50"
          aria-label="Abrir AI Command Center"
        >
          <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
        </button>
      )}

      <div
        className={cn(
          "fixed right-0 top-0 h-full w-80 sm:w-96 bg-card text-card-foreground border-l border-border shadow-2xl transition-transform duration-300 ease-in-out z-40 flex flex-col",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
             <div className="bg-primary/20 p-2 rounded-md">
                <Bot className="h-5 w-5 text-primary" />
             </div>
             <div>
               <h3 className="font-semibold text-sm">Agente de IA</h3>
               <p className="text-xs text-muted-foreground flex items-center">
                 Conectado a BigQuery <span className="w-1.5 h-1.5 rounded-full bg-green-500 ml-1.5 inline-block"></span>
               </p>
             </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-muted transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-4 text-sm bg-gradient-to-b from-background to-muted/5 scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={cn("flex flex-col max-w-[85%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
              <div className="flex items-center gap-2 mb-1 px-1">
                {msg.role === 'agent' ? <Bot className="h-3 w-3 text-primary" /> : <User className="h-3 w-3 text-muted-foreground" />}
                <span className="text-[10px] uppercase font-bold text-muted-foreground">{msg.role}</span>
              </div>
              <div className={cn(
                "p-3 rounded-2xl",
                msg.role === 'user' 
                  ? "bg-primary text-primary-foreground rounded-tr-sm" 
                  : "bg-background text-foreground rounded-tl-sm border border-border shadow-sm"
              )}>
                {/* Parsed pseudo-markdown para bold tags de Gemini */}
                <div className="whitespace-pre-wrap leading-relaxed" dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex flex-col max-w-[85%] mr-auto items-start">
              <div className="p-3 rounded-2xl bg-background text-foreground rounded-tl-sm border border-border flex items-center gap-2 shadow-sm">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-muted-foreground animate-pulse">Analizando la base de datos...</span>
              </div>
            </div>
          )}

          {messages.length === 1 && !loading && (
            <div className="flex flex-col gap-2 mt-4">
               <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Prueba preguntar:</span>
               <button onClick={() => handleSubmit(undefined, "Muéstrame el top 5 de entidades con mayor fuerza laboral")} className="text-left text-xs p-2.5 rounded-md border border-border bg-background hover:border-primary/50 transition-colors shadow-sm">
                 Muéstrame el top 5 de entidades con mayor fuerza laboral
               </button>
               <button onClick={() => handleSubmit(undefined, "¿Cuál es la ocupación más común globalmente?")} className="text-left text-xs p-2.5 rounded-md border border-border bg-background hover:border-primary/50 transition-colors shadow-sm">
                 ¿Cuál es la ocupación más común globalmente?
               </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border bg-background shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
          <form 
            className="flex items-center gap-2"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta analítica..."
              className="flex-1 h-10 px-3 rounded-md border border-input bg-background/50 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="h-10 w-10 shrink-0 bg-primary text-primary-foreground rounded-md flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

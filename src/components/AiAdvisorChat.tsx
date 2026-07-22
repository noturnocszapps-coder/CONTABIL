import React, { useState, useRef, useEffect } from 'react';
import { CompanyInfo, FinancialInputs, CalculatedMetrics, ChatMessage } from '../types';
import { Send, Bot, User, Sparkles, RefreshCw, MessageSquare, ArrowLeft, HelpCircle } from 'lucide-react';
import { formatCurrency } from '../lib/calculations';

interface AiAdvisorChatProps {
  company: CompanyInfo;
  inputs: FinancialInputs;
  metrics: CalculatedMetrics;
  onBackToDashboard: () => void;
}

const QUICK_PROMPTS = [
  'Explique meu Score',
  'Como posso melhorar minha preparação?',
  'Devo reajustar meus preços?',
  'Como reduzir meu impacto?',
  'Explique meu relatório',
  'Como negociar prazo de pagamento com meus fornecedores?',
];

export const AiAdvisorChat: React.FC<AiAdvisorChatProps> = ({
  company,
  inputs,
  metrics,
  onBackToDashboard,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Olá! Sou seu **Consultor Virtual em Split Payment & Reforma Tributária** da plataforma Split Ready AI.

Analisei os dados da **${company.nomeEmpresa}**:
- **Índice IPS:** ${metrics.ips.toFixed(2)} (${metrics.riscoTitulo})
- **Custo de Prazo de Recebimento (CFP):** ${formatCurrency(metrics.cfp)}/mês
- **Prazo Médio:** ${inputs.prazoMedio} dias | **Setor:** ${company.setor}

Como posso ajudar a proteger o caixa e a margem da sua empresa hoje? Escolha uma pergunta rápida abaixo ou digite sua dúvida!`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const contextData = {
        company,
        inputs,
        metrics: {
          ips: metrics.ips,
          cfp: metrics.cfp,
          rm: metrics.rm,
          riscoTitulo: metrics.riscoTitulo,
          reajusteRecomendadoPct: metrics.reajusteRecomendadoPct,
        },
      };

      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory, contextData }),
      });

      if (!response.ok) {
        throw new Error('Erro na comunicação com o assistente.');
      }

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.reply || 'Desculpe, não consegui entender a pergunta.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Erro no chat:', err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu uma instabilidade na conexão com a IA. Por favor, tente novamente.',
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 sm:px-6 h-[calc(100vh-5rem)] flex flex-col space-y-4">
      
      {/* Top Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToDashboard}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="p-2 bg-gradient-to-tr from-blue-600 to-emerald-500 rounded-xl text-white">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">Consultor IA - Split Payment</h2>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                Gemini 3.6 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Contexto ativo: <strong className="text-slate-200">{company.nomeEmpresa}</strong> (IPS: {metrics.ips.toFixed(2)})
            </p>
          </div>
        </div>
      </div>

      {/* Quick Prompt Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none shrink-0">
        <span className="text-xs text-slate-400 font-semibold shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" /> Dúvidas frequentes:
        </span>
        {QUICK_PROMPTS.map((promptText, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(promptText)}
            disabled={loading}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 text-slate-700 hover:text-blue-700 text-xs font-medium shrink-0 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-900 text-emerald-400'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-slate-50 border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs'
              }`}
            >
              <div
                className="space-y-2"
                dangerouslySetInnerHTML={{
                  __html: msg.content
                    .replace(/\n\n/g, '<br/><br/>')
                    .replace(/\n/g, '<br/>')
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'),
                }}
              />
              <span
                className={`text-[10px] block mt-2 text-right ${
                  msg.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-slate-900 text-emerald-400 shrink-0 animate-pulse">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs p-4 text-xs text-slate-500 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
              <span>O Especialista em Split Payment está analisando sua pergunta...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white border border-slate-300 rounded-2xl p-2 shadow-sm shrink-0 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
      >
        <input
          type="text"
          placeholder="Digite sua dúvida sobre a Reforma Tributária ou Split Payment..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 outline-none bg-transparent"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all disabled:opacity-40 active:scale-95 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
};

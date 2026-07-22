import React, { useState, useEffect } from 'react';
import { ARTICLES, Article } from '../data/articles';
import {
  BookOpen,
  Search,
  ArrowRight,
  Clock,
  Calendar,
  Sparkles,
  ShieldAlert,
  ChevronRight,
  Home,
  CheckCircle2,
  Share2
} from 'lucide-react';

interface ContentHubViewProps {
  onSelectArticle: (slug: string) => void;
  onNavigateHome: () => void;
  onOpenExpressDiagnosis: () => void;
}

export const ContentHubView: React.FC<ContentHubViewProps> = ({
  onSelectArticle,
  onNavigateHome,
  onOpenExpressDiagnosis,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = [
    'Todos',
    'Split Payment',
    'Fluxo de Caixa',
    'Reforma Tributária',
    'Planejamento Empresarial',
    'Gestão Financeira'
  ];

  const filteredArticles = ARTICLES.filter((article) => {
    const matchesCategory =
      selectedCategory === 'Todos' || article.category === selectedCategory;
    const matchesSearch =
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.keywords.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Dynamically update page title, meta description, canonical, and Schema.org BreadcrumbList
  useEffect(() => {
    document.title = 'Central de Conteúdos | Split Payment e Reforma Tributária - Split Ready AI';
    
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute(
      'content',
      'Artigos educativos e análises sobre Split Payment, EC 132/2023, IBS, CBS, fluxo de caixa e preparação de empresas para a Reforma Tributária.'
    );

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://contabil.ntaplicacoes.com.br/conteudos');

    // BreadcrumbList JSON-LD
    let scriptBreadcrumb = document.getElementById('jsonld-breadcrumb');
    if (!scriptBreadcrumb) {
      scriptBreadcrumb = document.createElement('script');
      scriptBreadcrumb.id = 'jsonld-breadcrumb';
      scriptBreadcrumb.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptBreadcrumb);
    }
    scriptBreadcrumb.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'name': 'Início',
          'item': 'https://contabil.ntaplicacoes.com.br/'
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'name': 'Central de Conteúdos',
          'item': 'https://contabil.ntaplicacoes.com.br/conteudos'
        }
      ]
    });
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header Banner / Breadcrumb */}
      <section className="bg-slate-900 border-b border-slate-800 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center space-x-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={onNavigateHome}
                  className="hover:text-cyan-400 flex items-center transition-colors"
                >
                  <Home className="w-4 h-4 mr-1" />
                  Início
                </button>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </li>
              <li className="text-cyan-400 font-medium" aria-current="page">
                Conteúdos
              </li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/50 text-cyan-400 text-xs font-semibold mb-4">
              <BookOpen className="w-3.5 h-3.5" />
              Central de Conhecimento e Educação Fiscal
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Reforma Tributária e Split Payment na Prática
            </h1>
            <p className="mt-3 text-lg text-slate-300 leading-relaxed">
              Guias educativos, análises técnicas e orientações preventivas sobre
              como proteger o fluxo de caixa da sua empresa antes da transição da EC 132/2023.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between items-stretch sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por assunto (ex: Split Payment, PMP, IBS)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-cyan-600 text-white shadow-md shadow-cyan-900/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/60'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 p-8">
            <BookOpen className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-200">
              Nenhum conteúdo encontrado para essa busca
            </h3>
            <p className="text-slate-400 text-sm mt-1 mb-6">
              Tente utilizar outros termos de busca ou selecionar outra categoria.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('Todos');
              }}
              className="px-4 py-2 bg-slate-800 text-cyan-400 hover:bg-slate-700 rounded-lg text-xs font-semibold transition-colors"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <article
                key={article.slug}
                className="bg-slate-900/80 rounded-2xl border border-slate-800 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-cyan-950/30 flex flex-col overflow-hidden group"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-cyan-950 text-cyan-400 font-semibold border border-cyan-800/40">
                      {article.category}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {article.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-3">
                    {article.title}
                  </h2>

                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3 mb-6 flex-1">
                    {article.description}
                  </p>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(article.publishedAt).toLocaleDateString('pt-BR')}
                    </span>

                    <button
                      onClick={() => onSelectArticle(article.slug)}
                      className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                    >
                      Ler artigo
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Diagnostic Callout Banner */}
        <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-900 to-cyan-950/60 rounded-2xl border border-cyan-800/50 p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              Diagnóstico de Liquidez em 2 minutos
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Quer saber como o Split Payment afetará o caixa da sua empresa?
            </h3>
            <p className="text-slate-300 text-sm sm:text-base mt-2 leading-relaxed">
              Faça o diagnóstico gratuito e descubra seu <strong>Split Ready Score™</strong>,
              avaliando seu nível de risco no capital de giro antes que as novas regras entrem em vigor.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <button
              onClick={onOpenExpressDiagnosis}
              className="px-6 py-3.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl transition-all shadow-lg shadow-cyan-500/20 text-sm flex items-center justify-center gap-2 whitespace-nowrap"
            >
              Fazer Diagnóstico Gratuito
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Disclaimer Notice */}
        <div className="mt-12 p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong>Aviso Educativo:</strong> Os conteúdos disponibilizados possuem caráter estritamente educativo, de inteligência de negócios e conscientização financeira. As informações são baseadas nas diretrizes gerais da EC 132/2023. Não substituem consultoria contábil ou planejamento tributário individualizado prestado por profissional habilitado.
          </p>
        </div>
      </main>
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Article, ARTICLES } from '../data/articles';
import {
  BookOpen,
  Calendar,
  Clock,
  ArrowLeft,
  ArrowRight,
  Share2,
  Check,
  ChevronRight,
  Home,
  ShieldAlert,
  Sparkles,
  HelpCircle,
  List
} from 'lucide-react';

interface ArticleDetailViewProps {
  slug: string;
  onNavigateHome: () => void;
  onNavigateContents: () => void;
  onSelectArticle: (slug: string) => void;
  onOpenExpressDiagnosis: () => void;
}

export const ArticleDetailView: React.FC<ArticleDetailViewProps> = ({
  slug,
  onNavigateHome,
  onNavigateContents,
  onSelectArticle,
  onOpenExpressDiagnosis,
}) => {
  const [copied, setCopied] = useState(false);
  const article = ARTICLES.find((a) => a.slug === slug);

  const relatedArticles = article
    ? ARTICLES.filter((a) => article.relatedSlugs.includes(a.slug))
    : [];

  useEffect(() => {
    if (!article) return;

    // Set page title and meta description
    document.title = `${article.seoTitle} | Split Ready AI`;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', article.description);

    // Set Canonical URL
    const canonicalUrl = `https://contabil.ntaplicacoes.com.br/conteudos/${article.slug}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', canonicalUrl);

    // Open Graph Title, Description, Image & URL
    const updateMeta = (prop: string, content: string) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    updateMeta('og:title', `${article.seoTitle} | Split Ready AI`);
    updateMeta('og:description', article.description);
    updateMeta('og:url', canonicalUrl);

    // Article / BlogPosting Schema.org JSON-LD
    let scriptArticle = document.getElementById('jsonld-article');
    if (!scriptArticle) {
      scriptArticle = document.createElement('script');
      scriptArticle.id = 'jsonld-article';
      scriptArticle.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptArticle);
    }
    scriptArticle.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': canonicalUrl
      },
      'headline': article.title,
      'description': article.description,
      'image': 'https://contabil.ntaplicacoes.com.br/og-image.jpg',
      'datePublished': article.publishedAt,
      'dateModified': article.updatedAt,
      'author': {
        '@type': 'Organization',
        'name': 'NT Aplicações',
        'url': 'https://www.ntaplicacoes.com.br/'
      },
      'publisher': {
        '@type': 'Organization',
        'name': 'NT Aplicações',
        'url': 'https://www.ntaplicacoes.com.br/'
      }
    });

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
          'name': 'Conteúdos',
          'item': 'https://contabil.ntaplicacoes.com.br/conteudos'
        },
        {
          '@type': 'ListItem',
          'position': 3,
          'name': article.title,
          'item': canonicalUrl
        }
      ]
    });

    // Scroll to top
    window.scrollTo(0, 0);
  }, [article, slug]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl font-bold mb-4">Conteúdo não encontrado</h1>
        <p className="text-slate-400 mb-6">
          O artigo solicitado não existe ou foi movido.
        </p>
        <button
          onClick={onNavigateContents}
          className="px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold transition-colors"
        >
          Voltar para Central de Conteúdos
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header / Breadcrumb / Title */}
      <header className="bg-slate-900 border-b border-slate-800 pt-8 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
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
              <li>
                <button
                  onClick={onNavigateContents}
                  className="hover:text-cyan-400 transition-colors"
                >
                  Conteúdos
                </button>
              </li>
              <li>
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </li>
              <li className="text-cyan-400 font-medium truncate max-w-xs sm:max-w-md" aria-current="page">
                {article.title}
              </li>
            </ol>
          </nav>

          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 text-xs font-bold border border-cyan-800/50">
              {article.category}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-6">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <div className="flex items-center space-x-4">
              <span>
                Por <strong>NT Aplicações</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Atualizado em {new Date(article.updatedAt).toLocaleDateString('pt-BR')}
              </span>
            </div>

            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Link Copiado!
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                  Compartilhar
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Table of Contents */}
        <div className="mb-10 p-6 bg-slate-900/90 rounded-2xl border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 text-sm font-bold mb-3">
            <List className="w-4 h-4" />
            Neste artigo você verá:
          </div>
          <ul className="space-y-2 text-sm text-slate-300">
            {article.content.sections.map((sec) => (
              <li key={sec.id}>
                <a
                  href={`#${sec.id}`}
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <span className="text-cyan-500">•</span>
                  {sec.title}
                </a>
              </li>
            ))}
            {article.content.faqs && article.content.faqs.length > 0 && (
              <li>
                <a
                  href="#perguntas-frequentes"
                  className="hover:text-cyan-400 transition-colors flex items-center gap-2"
                >
                  <span className="text-cyan-500">•</span>
                  Perguntas Frequentes
                </a>
              </li>
            )}
          </ul>
        </div>

        {/* Intro */}
        <div className="text-lg text-slate-200 leading-relaxed font-normal mb-8 pb-8 border-b border-slate-800">
          {article.content.intro}
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {article.content.sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-4 pb-2 border-b border-slate-800/60">
                {sec.title}
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6 whitespace-pre-line">
                {sec.content}
              </p>

              {sec.subsections && sec.subsections.length > 0 && (
                <div className="space-y-6 mt-6 pl-4 border-l-2 border-cyan-500/40">
                  {sec.subsections.map((sub, idx) => (
                    <div key={idx}>
                      <h3 className="text-xl font-bold text-cyan-300 mb-2">
                        {sub.title}
                      </h3>
                      <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                        {sub.content}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}

          {/* Article Contextual FAQs */}
          {article.content.faqs && article.content.faqs.length > 0 && (
            <section id="perguntas-frequentes" className="pt-8 scroll-mt-24">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6 flex items-center gap-2">
                <HelpCircle className="w-6 h-6 text-cyan-400" />
                Perguntas Frequentes Relacionadas
              </h2>
              <div className="space-y-4">
                {article.content.faqs.map((faq, i) => (
                  <div
                    key={i}
                    className="p-5 bg-slate-900/80 rounded-xl border border-slate-800"
                  >
                    <h3 className="text-lg font-bold text-slate-100 mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Call to Action Box */}
        <div className="my-14 p-8 bg-gradient-to-br from-slate-900 via-slate-900 to-cyan-950/80 rounded-2xl border border-cyan-800/60 shadow-xl">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold w-fit mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Simulador de Impacto em Tempo Real
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Avalie o impacto do Split Payment no seu fluxo de caixa agora mesmo
          </h3>
          <p className="text-slate-300 text-sm mb-6 max-w-2xl leading-relaxed">
            Nossa plataforma gera um diagnóstico completo e calcula o <strong>Split Ready Score™</strong> da sua empresa de forma preventiva e gratuita.
          </p>
          <button
            onClick={onOpenExpressDiagnosis}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-lg shadow-cyan-500/20 flex items-center gap-2"
          >
            Realizar Diagnóstico Gratuito
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="pt-10 border-t border-slate-800">
            <h3 className="text-xl font-bold text-white mb-6">
              Conteúdos Relacionados
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedArticles.map((rel) => (
                <div
                  key={rel.slug}
                  onClick={() => onSelectArticle(rel.slug)}
                  className="p-5 bg-slate-900/80 rounded-xl border border-slate-800 hover:border-cyan-500/50 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                      {rel.category}
                    </span>
                    <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors mt-1 mb-2 line-clamp-2">
                      {rel.title}
                    </h4>
                  </div>
                  <span className="text-xs text-cyan-400 font-semibold flex items-center gap-1 mt-4">
                    Ler artigo
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer Footer */}
        <div className="mt-12 p-4 bg-slate-900/40 rounded-xl border border-slate-800/60 text-xs text-slate-400 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p>
            <strong>Aviso Legal & Educativo:</strong> As informações contidas neste artigo possuem finalidade meramente educativa e informativa. A regulamentação definitiva dos dispositivos da Emenda Constitucional nº 132/2023 dependerá de Leis Complementares e Resoluções Oficiais dos órgãos governamentais.
          </p>
        </div>

        {/* Back Button */}
        <div className="mt-8">
          <button
            onClick={onNavigateContents}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Central de Conteúdos
          </button>
        </div>
      </main>
    </div>
  );
};

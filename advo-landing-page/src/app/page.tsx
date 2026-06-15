"use client";

import React, { useState, useEffect, useRef } from "react";

// --- Reveal Component ---
interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delayClass?: string;
  scale?: boolean;
}

function Reveal({ children, className = "", delayClass = "", scale = false }: RevealProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && active) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -60px 0px",
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      active = false;
      observer.disconnect();
    };
  }, []);

  const combinedClass = `reveal ${scale ? "reveal--scale" : ""} ${delayClass} ${
    isVisible ? "reveal--visible" : ""
  } ${className}`;

  return (
    <div ref={ref} className={combinedClass}>
      {children}
    </div>
  );
}

// --- FAQ Item Component ---
interface FaqItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
}

function FaqItem({ question, answer, isOpen, onToggle, id }: FaqItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  return (
    <div className="faq__item">
      <button
        className="faq__question"
        aria-expanded={isOpen}
        onClick={onToggle}
        id={`faq-q-${id}`}
      >
        <span>{question}</span>
        <span className="faq__icon">
          <svg viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </span>
      </button>
      <div
        className={`faq__answer ${isOpen ? "faq__answer--open" : ""}`}
        role="region"
        aria-labelledby={`faq-q-${id}`}
        style={{
          maxHeight: height,
        }}
      >
        <div ref={contentRef} className="faq__answer-content">
          {answer}
        </div>
      </div>
    </div>
  );
}

// --- Animated Counter Component ---
interface AnimatedCounterProps {
  target: number;
  prefix?: string;
  suffix?: string;
}

function AnimatedCounter({ target, prefix = "", suffix = "" }: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && active) {
          animate();
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.5 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    function animate() {
      const duration = 1500;
      const startTime = performance.now();

      function update(currentTime: number) {
        if (!active) return;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(eased * target);

        setCount(current);

        if (progress < 1) {
          requestAnimationFrame(update);
        }
      }

      requestAnimationFrame(update);
    }

    return () => {
      active = false;
      observer.disconnect();
    };
  }, [target]);

  return (
    <div ref={elementRef} className="feature-card__metric">
      {prefix}
      {count.toLocaleString("pt-BR")}
      {suffix}
    </div>
  );
}

// --- Main Page Component ---
export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Scroll event for Navbar background color
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Smooth scroll helper
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) return;

    const navbar = document.getElementById("navbar");
    const navbarHeight = navbar ? navbar.offsetHeight : 72;
    const targetPosition = element.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    setIsMenuOpen(false);
    document.body.style.overflow = "";
  };

  const toggleMenu = () => {
    const nextState = !isMenuOpen;
    setIsMenuOpen(nextState);
    document.body.style.overflow = nextState ? "hidden" : "";
  };

  const handleToggleFaq = (index: number) => {
    setOpenFaqIndex((prev) => (prev === index ? null : index));
  };

  // Mockup chart bar heights
  const barHeights = [65, 40, 80, 55, 90, 35, 70, 50, 85, 45, 75, 60];

  const faqData = [
    {
      question: "Como funciona a segurança dos meus dados?",
      answer: "O ADVO utiliza autenticação baseada em tokens JWT com renovação proativa. Após 15 minutos de inatividade, a sessão é encerrada automaticamente para garantir a proteção total dos seus dados. Todas as comunicações são criptografadas e as senhas são armazenadas com hash seguro.",
    },
    {
      question: "Posso vincular despesas a processos específicos?",
      answer: "Sim! O módulo financeiro permite associação direta de receitas e despesas tanto a Clientes quanto a Processos. Isso facilita o controle de honorários, custas processuais e qualquer movimentação financeira vinculada a um caso específico.",
    },
    {
      question: "Como funciona o cadastro de endereços?",
      answer: "Ao cadastrar um cliente, basta digitar o CEP e o sistema preenche automaticamente logradouro, bairro, cidade e estado utilizando integração em tempo real com a base do ViaCEP. Rápido, preciso e sem digitação desnecessária.",
    },
    {
      question: "O sistema funciona em dispositivos móveis?",
      answer: "Sim. O ADVO foi desenvolvido com design responsivo, adaptando-se perfeitamente a smartphones, tablets e desktops. Acesse de qualquer lugar com a mesma experiência premium.",
    },
    {
      question: "Quais os níveis de permissão disponíveis?",
      answer: "O sistema oferece quatro níveis de acesso: Administrador (acesso total), Advogado (gestão de processos e finanças), Estagiário (visualização e tarefas limitadas) e Secretaria (cadastros e agenda). Cada nível garante que cada membro da equipe veja apenas o que precisa.",
    },
  ];

  return (
    <>
      {/* Navbar */}
      <nav
        className={`navbar ${isScrolled ? "navbar--scrolled" : ""}`}
        id="navbar"
        aria-label="Navegação principal"
      >
        <div className="navbar__inner">
          <a
            href="#"
            className="navbar__logo"
            aria-label="ADVO — Página inicial"
            onClick={(e) => handleScrollTo(e, "hero")}
          >
            <span className="navbar__logo-icon">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ width: "18px", height: "18px" }}
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </span>
            <span>ADVO</span>
          </a>

          <button
            className={`navbar__toggle ${isMenuOpen ? "navbar__toggle--active" : ""}`}
            id="navbar-toggle"
            aria-label="Abrir menu"
            aria-expanded={isMenuOpen}
            aria-controls="navbar-menu"
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          <div
            className={`navbar__menu ${isMenuOpen ? "navbar__menu--open" : ""}`}
            id="navbar-menu"
          >
            <div className="navbar__links">
              <a
                href="#modulos"
                className="navbar__link"
                onClick={(e) => handleScrollTo(e, "modulos")}
              >
                Módulos
              </a>
              <a
                href="#diferenciais"
                className="navbar__link"
                onClick={(e) => handleScrollTo(e, "diferenciais")}
              >
                Diferenciais
              </a>
              <a
                href="#faq"
                className="navbar__link"
                onClick={(e) => handleScrollTo(e, "faq")}
              >
                FAQ
              </a>
            </div>
            <a href="#" className="btn btn--primary navbar__cta" id="nav-cta">
              Começar Agora
            </a>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="section section--hero" id="hero">
          <div className="hero__ambient"></div>
          <div className="container">
            <div className="hero">
              <div className="hero__badge">
                <span className="hero__badge-dot"></span>
                Sistema Jurídico Inteligente
              </div>

              <h1 className="hero__title">
                A gestão jurídica do<br />
                <span className="text-gradient">futuro, simples e</span><br />
                <span className="text-gradient">em tempo real.</span>
              </h1>

              <p className="hero__subtitle">
                Controle processos, gerencie prazos com calendário interativo,
                organize tarefas em Kanban e monitore seu fluxo de caixa —
                tudo em uma plataforma rápida, integrada e segura.
              </p>

              <div className="hero__actions">
                <a href="#" className="btn btn--primary btn--lg" id="hero-cta-primary">
                  Começar Agora — Grátis
                  <span className="btn--icon">→</span>
                </a>
                <a href="#" className="btn btn--secondary btn--lg" id="hero-cta-secondary">
                  Acessar Minha Conta
                </a>
              </div>

              {/* Dashboard Mockup */}
              <div className="hero__mockup hero__mockup-float">
                <div className="hero__mockup-glow"></div>
                <div className="dashboard-mockup">
                  <div className="dashboard-mockup__topbar">
                    <div className="dashboard-mockup__dot"></div>
                    <div className="dashboard-mockup__dot"></div>
                    <div className="dashboard-mockup__dot"></div>
                  </div>
                  <div className="dashboard-mockup__body">
                    <div className="dashboard-mockup__sidebar">
                      <div className="dashboard-mockup__sidebar-item dashboard-mockup__sidebar-item--active">
                        <div className="dashboard-mockup__sidebar-icon"></div>
                        <div className="dashboard-mockup__sidebar-label"></div>
                      </div>
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="dashboard-mockup__sidebar-item">
                          <div className="dashboard-mockup__sidebar-icon"></div>
                          <div className="dashboard-mockup__sidebar-label"></div>
                        </div>
                      ))}
                    </div>
                    <div className="dashboard-mockup__content">
                      <div className="dashboard-mockup__stats">
                        <div className="dashboard-mockup__stat">
                          <div className="dashboard-mockup__stat-value"></div>
                          <div className="dashboard-mockup__stat-label"></div>
                        </div>
                        <div className="dashboard-mockup__stat">
                          <div className="dashboard-mockup__stat-value"></div>
                          <div className="dashboard-mockup__stat-label"></div>
                        </div>
                        <div className="dashboard-mockup__stat">
                          <div className="dashboard-mockup__stat-value"></div>
                          <div className="dashboard-mockup__stat-label"></div>
                        </div>
                      </div>
                      <div className="dashboard-mockup__chart">
                        {barHeights.map((h, i) => (
                          <div
                            key={i}
                            className="dashboard-mockup__bar"
                            style={{ height: `${h}%` }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modules Section */}
        <section className="section" id="modulos">
          <div className="container">
            <Reveal className="section__header">
              <span className="section__label">⚡ Módulos</span>
              <h2 className="section__title">
                Tudo que seu escritório<br />
                <span className="text-gradient">precisa em um só lugar.</span>
              </h2>
              <p className="section__description">
                Sete módulos integrados, desenhados para simplificar a rotina jurídica do seu escritório.
              </p>
            </Reveal>

            <div className="grid grid--3" id="modules-grid">
              {/* Módulo 1: Segurança */}
              <Reveal className="glass-card" delayClass="reveal--delay-1">
                <div className="glass-card__icon">🔐</div>
                <h3 className="glass-card__title">Segurança & Acesso</h3>
                <p className="glass-card__text">
                  Autenticação robusta com tokens JWT, renovação proativa de sessão
                  e encerramento automático após inatividade.
                </p>
              </Reveal>

              {/* Módulo 2: Clientes */}
              <Reveal className="glass-card" delayClass="reveal--delay-2">
                <div className="glass-card__icon">👥</div>
                <h3 className="glass-card__title">Clientes</h3>
                <p className="glass-card__text">
                  Cadastro completo com busca automática de endereço por CEP.
                  Dados organizados e acessíveis em segundos.
                </p>
              </Reveal>

              {/* Módulo 3: Processos */}
              <Reveal className="glass-card" delayClass="reveal--delay-3">
                <div className="glass-card__icon">⚖️</div>
                <h3 className="glass-card__title">Processos</h3>
                <p className="glass-card__text">
                  Painel de controle de processos com acompanhamento de
                  movimentações, timeline e partes contrárias.
                </p>
              </Reveal>

              {/* Módulo 4: Agenda */}
              <Reveal className="glass-card" delayClass="reveal--delay-4">
                <div className="glass-card__icon">📅</div>
                <h3 className="glass-card__title">Agenda</h3>
                <p className="glass-card__text">
                  Calendário interativo para audiências, prazos e reuniões.
                  Nunca mais perca um compromisso importante.
                </p>
              </Reveal>

              {/* Módulo 5: Tarefas */}
              <Reveal className="glass-card" delayClass="reveal--delay-5">
                <div className="glass-card__icon">📋</div>
                <h3 className="glass-card__title">Tarefas Kanban</h3>
                <p className="glass-card__text">
                  Quadro Kanban visual para organizar o fluxo de trabalho.
                  Arraste, priorize e acompanhe o progresso da equipe.
                </p>
              </Reveal>

              {/* Módulo 6: Documentos */}
              <Reveal className="glass-card" delayClass="reveal--delay-6">
                <div className="glass-card__icon">📄</div>
                <h3 className="glass-card__title">Documentos</h3>
                <p className="glass-card__text">
                  Upload seguro de petições, procurações e contratos,
                  diretamente anexados aos processos.
                </p>
              </Reveal>

              {/* Módulo 7: Financeiro */}
              <Reveal className="glass-card module-highlight" delayClass="reveal--delay-7">
                <div className="glass-card__icon">💰</div>
                <h3 className="glass-card__title">Financeiro</h3>
                <p className="glass-card__text">
                  Fluxo de caixa com totalizadores automáticos, controle de baixas
                  de honorários e receitas/despesas vinculadas a processos.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Differentials Section */}
        <section className="section" id="diferenciais">
          <div className="container">
            <Reveal className="section__header">
              <span className="section__label">🏗️ Arquitetura</span>
              <h2 className="section__title">
                Construído para<br />
                <span className="text-gradient">performance máxima.</span>
              </h2>
              <p className="section__description">
                Tecnologia de ponta garantindo velocidade, segurança e confiabilidade
                para o seu escritório.
              </p>
            </Reveal>

            <div className="grid grid--4">
              <Reveal className="glass-card feature-card" delayClass="reveal--delay-1">
                <AnimatedCounter target={100} suffix="ms" />
                <h3 className="feature-card__title">Ultra Rápido</h3>
                <p className="feature-card__text">
                  Construído com Vite + React para carregamento instantâneo sem travamentos.
                </p>
              </Reveal>

              <Reveal className="glass-card feature-card" delayClass="reveal--delay-2">
                <AnimatedCounter target={100} suffix="%" />
                <h3 className="feature-card__title">API-Driven</h3>
                <p className="feature-card__text">
                  Comunicação padronizada seguindo especificações OpenAPI completas.
                </p>
              </Reveal>

              <Reveal className="glass-card feature-card" delayClass="reveal--delay-3">
                <AnimatedCounter target={4} suffix=" níveis" />
                <h3 className="feature-card__title">Controle de Acesso</h3>
                <p className="feature-card__text">
                  Permissões granulares: Admin, Advogado, Estagiário e Secretaria.
                </p>
              </Reveal>

              <Reveal className="glass-card feature-card" delayClass="reveal--delay-4">
                <div className="feature-card__metric">&lt;1s</div>
                <h3 className="feature-card__title">Atualização Otimista</h3>
                <p className="feature-card__text">
                  Alterações refletem instantaneamente, sincronizando em segundo plano.
                </p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="section" id="faq">
          <div className="container">
            <Reveal className="section__header">
              <span className="section__label">❓ FAQ</span>
              <h2 className="section__title">
                Perguntas<br />
                <span className="text-gradient">frequentes.</span>
              </h2>
            </Reveal>

            <Reveal className="faq">
              {faqData.map((item, index) => (
                <FaqItem
                  key={index}
                  id={String(index + 1)}
                  question={item.question}
                  answer={item.answer}
                  isOpen={openFaqIndex === index}
                  onToggle={() => handleToggleFaq(index)}
                />
              ))}
            </Reveal>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="section" id="cta-final">
          <div className="container">
            <Reveal className="cta-section" scale={true}>
              <div className="cta-section__bg"></div>
              <div className="cta-section__glow"></div>
              <div className="cta-section__content">
                <h2 className="cta-section__title">
                  Pronto para transformar a<br />
                  <span className="text-gradient">gestão do seu escritório?</span>
                </h2>
                <p className="cta-section__text">
                  Comece gratuitamente e descubra como o ADVO pode
                  simplificar sua rotina jurídica.
                </p>
                <div className="flex flex--center flex--gap" style={{ flexWrap: "wrap" }}>
                  <a href="#" className="btn btn--primary btn--lg" id="final-cta-primary">
                    Criar Conta Gratuita
                    <span className="btn--icon">→</span>
                  </a>
                  <a href="#" className="btn btn--secondary btn--lg" id="final-cta-secondary">
                    Falar com Especialista
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer" id="footer">
        <div className="container">
          <div className="footer__inner">
            <div className="footer__brand">
              <span className="footer__brand-icon">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ width: "14px", height: "14px" }}
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </span>
              <span>ADVO</span>
            </div>

            <p className="footer__copy">
              © {new Date().getFullYear()} ADVO. Todos os direitos reservados.
            </p>

            <div className="footer__links">
              <a href="#" className="footer__link">Termos de Uso</a>
              <a href="#" className="footer__link">Privacidade</a>
              <a href="#" className="footer__link">Contato</a>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

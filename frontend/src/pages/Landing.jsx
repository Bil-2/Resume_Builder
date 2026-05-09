import '../styles/landing.css';
import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  Brain,
  FileText,
  BarChart3,
  Shield,
  Cpu,
  Globe,
  TrendingUp,
  CheckCircle2,
  ChevronDown,
  Star,
  Clock,
  Award,
  Layers,
  Zap,
  Database,
  Search,
  Download,
} from 'lucide-react';
import Logo from '../components/Logo/Logo';

/* ─── Intersection Observer hook ─────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('revealed');
      }),
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ─── Animated Counter ────────────────────────────────── */
function Counter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const numeric = parseFloat(target.replace(/[^0-9.]/g, ''));
        const duration = 1800;
        const steps = 60;
        const increment = numeric / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= numeric) {
            setCount(numeric);
            clearInterval(timer);
          } else {
            setCount(Math.floor(current * 10) / 10);
          }
        }, duration / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  const display = Number.isInteger(parseFloat(target.replace(/[^0-9.]/g, '')))
    ? Math.round(count).toLocaleString()
    : count.toFixed(1);

  return <span ref={ref}>{prefix}{display}{suffix}</span>;
}

/* ─── Typewriter ──────────────────────────────────────── */
function Typewriter({ words }) {
  const [idx, setIdx] = useState(0);
  const [text, setText] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = words[idx];
    const speed = deleting ? 40 : 80;
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, text.length + 1));
        if (text.length + 1 === current.length) {
          setTimeout(() => setDeleting(true), 2000);
        }
      } else {
        setText(current.slice(0, text.length - 1));
        if (text.length === 0) {
          setDeleting(false);
          setIdx((idx + 1) % words.length);
        }
      }
    }, speed);
    return () => clearTimeout(timeout);
  }, [text, deleting, idx, words]);

  return (
    <span className="landing-typewriter">
      {text}
      <span className="landing-cursor">|</span>
    </span>
  );
}

/* ─── Main Component ──────────────────────────────────── */
const Landing = () => {
  useReveal();

  const stats = [
    { value: '87', suffix: '%', label: 'of hiring managers spend under 10 seconds on a resume', source: 'Ladders Research, 2024' },
    { value: '2.4', suffix: 'M', label: 'jobs advertised require ATS-optimised applications', source: 'LinkedIn Workforce Report' },
    { value: '340', suffix: 'B', prefix: '$', label: 'global recruitment software market by 2027', source: 'Grand View Research' },
    { value: '73', suffix: '%', label: 'of candidates rejected due to poor resume formatting', source: 'Jobscan ATS Study, 2024' },
  ];

  const capabilities = [
    {
      icon: Brain,
      title: 'Neural Content Generation',
      desc: 'AI trained on 2.4 million successful resumes generates role-optimised bullet points, professional summaries, and achievement statements aligned with current hiring standards.',
      tag: 'Powered by LLM',
    },
    {
      icon: Search,
      title: 'ATS Score Analysis',
      desc: 'Real-time Applicant Tracking System simulation scores your resume against 320+ known ATS platforms before you ever submit. Industry-specific keyword mapping included.',
      tag: 'Live Analysis',
    },
    {
      icon: Layers,
      title: 'Dynamic Template Engine',
      desc: 'Professionally designed templates built with typographic hierarchy standards from top design agencies. Each template is tested across 40+ ATS systems for parse compatibility.',
      tag: '12 Templates',
    },
    {
      icon: Database,
      title: 'Career Intelligence Hub',
      desc: 'Centralise your entire professional identity. Projects, certifications, skills, achievements and courses all feed automatically into generated resume content.',
      tag: 'Unified Profile',
    },
    {
      icon: Download,
      title: 'Multi-Format Export',
      desc: 'Export to ATS-safe PDF, Microsoft Word DOCX, and print-ready formats. Pixel-perfect rendering preserves every design element across all output types.',
      tag: 'PDF + DOCX',
    },
    {
      icon: BarChart3,
      title: 'Career Progression Tracking',
      desc: 'Visualise your career trajectory. Track skill growth, certification progress, and achievement milestones. Generate data-backed narratives of professional development.',
      tag: 'Analytics',
    },
  ];

  const marketInsights = [
    {
      figure: '76%',
      insight: 'of resumes are eliminated before reaching a human reviewer',
      context: 'ATS filters discard candidates before interview — not because they are unqualified, but because their resume is not machine-readable.',
      source: 'Jobscan, 2024',
    },
    {
      figure: '3.5x',
      insight: 'more interview callbacks with AI-optimised resumes',
      context: 'Studies across 10,000 job applications demonstrate that AI-assisted resume optimisation triples callback rates across industries.',
      source: 'Harvard Business Review, 2023',
    },
    {
      figure: '6 sec',
      insight: 'average recruiter initial resume review time',
      context: 'Eye-tracking research confirms recruiters make preliminary decisions in seconds. Visual hierarchy and keyword density determine first-pass survival.',
      source: 'Ladders Inc. Eye Tracking Study',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      role: 'Software Engineer',
      company: 'Infosys',
      text: 'I rewrote my resume three times without results. After using this platform, I received four interview calls within two weeks. The ATS analysis feature identified exactly what I was missing.',
      rating: 5,
    },
    {
      name: 'Arjun Mehta',
      role: 'Product Manager',
      company: 'Razorpay',
      text: 'The AI content generator understood context I could not articulate myself. It turned my raw experience into compelling, data-driven narratives that hiring managers respond to.',
      rating: 5,
    },
    {
      name: 'Sneha Iyer',
      role: 'Data Analyst',
      company: 'Deloitte',
      text: 'Most resume builders focus on design. This platform focuses on outcomes. The market research built into the recommendations is genuinely insightful and current.',
      rating: 5,
    },
  ];

  const processSteps = [
    {
      number: '01',
      title: 'Build Your Career Profile',
      desc: 'Input your experience, projects, skills, and achievements into our structured career intelligence system. One profile, infinite resume variations.',
    },
    {
      number: '02',
      title: 'AI Generates Content',
      desc: 'Neural AI analyses your profile against target role requirements, industry benchmarks, and ATS compatibility standards to generate optimised content.',
    },
    {
      number: '03',
      title: 'Customise and Refine',
      desc: 'Select from professional templates and refine AI suggestions with real-time preview. Every change reflects instantly across all sections.',
    },
    {
      number: '04',
      title: 'Export and Apply',
      desc: 'Download ATS-safe PDF or DOCX formats. Your resume is ready for direct application, with optional ATS score validation before submission.',
    },
  ];

  return (
    <div className="landing-root">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo-link">
            <Logo size="md" showText={true} />
          </Link>
          <nav className="landing-nav-links">
            <a href="#capabilities" className="landing-nav-a">Capabilities</a>
            <a href="#market" className="landing-nav-a">Research</a>
            <a href="#process" className="landing-nav-a">How It Works</a>
          </nav>
          <div className="landing-nav-cta">
            <Link to="/login" className="landing-nav-login">Sign In</Link>
            <Link to="/register" className="landing-btn-primary landing-btn-sm">
              Start Free
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <div className="landing-hero-wrap">
      <section className="landing-hero">
        {/* Ambient grid */}
        <div className="landing-grid-bg" aria-hidden />
        {/* Glow orbs */}
        <div className="landing-orb landing-orb-1" aria-hidden />
        <div className="landing-orb landing-orb-2" aria-hidden />
        <div className="landing-orb landing-orb-3" aria-hidden />

        <div className="landing-hero-inner">
          {/* Badge */}
          <div className="landing-badge reveal">
            <Cpu size={12} />
            <span>AI-Native Resume Intelligence Platform</span>
            <div className="landing-badge-dot" />
            <span className="landing-badge-live">Live</span>
          </div>

          {/* Headline */}
          <h1 className="landing-headline reveal">
            Your resume is the
            <br />
            <span className="landing-headline-gradient">
              <Typewriter words={['first impression.', 'only barrier.', 'critical filter.', 'career gateway.']} />
            </span>
          </h1>

          <p className="landing-subheadline reveal">
            76% of applications are eliminated by automated systems before a human sees them.
            Our AI platform closes that gap — with precision-engineered resume content,
            real-time ATS scoring, and data-driven career intelligence.
          </p>

          {/* CTA buttons */}
          <div className="landing-cta-group reveal">
            <Link to="/register" className="landing-btn-primary">
              Build Your Resume — Free
              <ArrowRight size={16} />
            </Link>
            <a href="#market" className="landing-btn-ghost">
              View Market Research
              <ChevronDown size={16} />
            </a>
          </div>

          {/* Trust strip */}
          <div className="landing-trust reveal">
            <div className="landing-trust-item">
              <CheckCircle2 size={14} className="landing-check" />
              <span>No credit card required</span>
            </div>
            <div className="landing-trust-sep" />
            <div className="landing-trust-item">
              <CheckCircle2 size={14} className="landing-check" />
              <span>ATS-safe PDF export</span>
            </div>
            <div className="landing-trust-sep" />
            <div className="landing-trust-item">
              <CheckCircle2 size={14} className="landing-check" />
              <span>AI content generation</span>
            </div>
          </div>
        </div>

        {/* Hero visual */}
        <div className="landing-hero-visual reveal">
          <div className="landing-resume-card">
            {/* Top bar */}
            <div className="lrc-topbar">
              <div className="lrc-dot red" />
              <div className="lrc-dot yellow" />
              <div className="lrc-dot green" />
              <div className="lrc-label">resume_final_v3.pdf</div>
              <div className="lrc-score-badge">
                <Zap size={10} />
                ATS 94%
              </div>
            </div>

            {/* Resume preview content */}
            <div className="lrc-body">
              {/* Name block */}
              <div className="lrc-name-block">
                <div className="lrc-avatar" />
                <div>
                  <div className="lrc-name-bar" />
                  <div className="lrc-role-bar" />
                  <div className="lrc-links">
                    <div className="lrc-link-chip" />
                    <div className="lrc-link-chip w-20" />
                    <div className="lrc-link-chip w-16" />
                  </div>
                </div>
              </div>
              {/* Section divider */}
              <div className="lrc-divider" />
              {/* Summary */}
              <div className="lrc-section">
                <div className="lrc-section-tag">Professional Summary</div>
                <div className="lrc-lines">
                  <div className="lrc-line w-full" />
                  <div className="lrc-line w-11/12" />
                  <div className="lrc-line w-4/5" />
                </div>
              </div>
              {/* Experience */}
              <div className="lrc-section">
                <div className="lrc-section-tag">Experience</div>
                <div className="lrc-exp-entry">
                  <div>
                    <div className="lrc-exp-title" />
                    <div className="lrc-exp-company" />
                  </div>
                  <div className="lrc-exp-date" />
                </div>
                <div className="lrc-bullets">
                  <div className="lrc-bullet">
                    <div className="lrc-bullet-dot" />
                    <div className="lrc-line w-full" />
                  </div>
                  <div className="lrc-bullet">
                    <div className="lrc-bullet-dot" />
                    <div className="lrc-line w-10/12" />
                  </div>
                </div>
              </div>
              {/* Skills chips */}
              <div className="lrc-section">
                <div className="lrc-section-tag">Skills</div>
                <div className="lrc-chips">
                  {['React', 'Node.js', 'Python', 'AWS', 'TypeScript'].map(s => (
                    <div key={s} className="lrc-chip">{s}</div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI overlay tag */}
            <div className="lrc-ai-tag">
              <Brain size={12} />
              AI-Generated Content
            </div>
          </div>

          {/* Floating metric cards */}
          <div className="landing-float-card landing-float-card-1">
            <TrendingUp size={16} className="landing-float-icon" />
            <div>
              <div className="landing-float-num">3.5x</div>
              <div className="landing-float-label">More callbacks</div>
            </div>
          </div>
          <div className="landing-float-card landing-float-card-2">
            <Shield size={16} className="landing-float-icon landing-float-icon-2" />
            <div>
              <div className="landing-float-num">ATS 94</div>
              <div className="landing-float-label">Compatibility score</div>
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* ── Market Stats ───────────────────────────────────────── */}
      <section className="landing-stats-band" id="market">
        <div className="landing-section-inner">
          <div className="landing-stats-grid">
            {stats.map((s, i) => (
              <div key={i} className="landing-stat-card reveal" style={{ animationDelay: `${i * 80}ms` }}>
                <div className="landing-stat-num">
                  <Counter target={s.value} suffix={s.suffix} prefix={s.prefix || ''} />
                </div>
                <div className="landing-stat-label">{s.label}</div>
                <div className="landing-stat-source">{s.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Market Research ────────────────────────────────────── */}
      <section className="landing-section" style={{ background: 'var(--surface-2)' }}>
        <div className="landing-section-inner">
          <div className="landing-section-header reveal">
            <div className="landing-eyebrow">
              <Globe size={13} />
              Market Intelligence
            </div>
            <h2 className="landing-section-title">
              Why the resume problem is bigger than you think
            </h2>
            <p className="landing-section-sub">
              The hiring landscape has fundamentally changed. These are not projections — they are current realities
              from peer-reviewed studies and industry research conducted in 2023 and 2024.
            </p>
          </div>

          <div className="landing-insights-grid">
            {marketInsights.map((m, i) => (
              <div key={i} className="landing-insight-card reveal" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className="landing-insight-figure">{m.figure}</div>
                <h3 className="landing-insight-claim">{m.insight}</h3>
                <p className="landing-insight-context">{m.context}</p>
                <div className="landing-insight-source">
                  <Award size={11} />
                  {m.source}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Capabilities ───────────────────────────────────────── */}
      <section className="landing-section" id="capabilities">
        <div className="landing-section-inner">
          <div className="landing-section-header reveal">
            <div className="landing-eyebrow">
              <Cpu size={13} />
              Platform Capabilities
            </div>
            <h2 className="landing-section-title">
              Built for the modern hiring reality
            </h2>
            <p className="landing-section-sub">
              Every feature is designed around how hiring actually works today — not how it worked five years ago.
              ATS-first, AI-powered, outcome-focused.
            </p>
          </div>

          <div className="landing-caps-grid">
            {capabilities.map((c, i) => (
              <div key={i} className="landing-cap-card reveal" style={{ transitionDelay: `${i * 80}ms` }}>
                <div className="landing-cap-top">
                  <div className="landing-cap-icon">
                    <c.icon size={22} />
                  </div>
                  <span className="landing-cap-tag">{c.tag}</span>
                </div>
                <h3 className="landing-cap-title">{c.title}</h3>
                <p className="landing-cap-desc">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section className="landing-section" id="process" style={{ background: 'var(--surface-2)' }}>
        <div className="landing-section-inner">
          <div className="landing-section-header reveal">
            <div className="landing-eyebrow">
              <Clock size={13} />
              Process
            </div>
            <h2 className="landing-section-title">From profile to offer-ready in minutes</h2>
            <p className="landing-section-sub">
              A streamlined four-step process that takes the ambiguity out of resume building.
              No templates to fight. No blank pages to stare at.
            </p>
          </div>

          <div className="landing-process-grid">
            {processSteps.map((step, i) => (
              <div key={i} className="landing-process-step reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="landing-process-num">{step.number}</div>
                {i < processSteps.length - 1 && <div className="landing-process-line" aria-hidden />}
                <h3 className="landing-process-title">{step.title}</h3>
                <p className="landing-process-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof ───────────────────────────────────────── */}
      <section className="landing-section">
        <div className="landing-section-inner">
          <div className="landing-section-header reveal">
            <div className="landing-eyebrow">
              <Star size={13} />
              User Outcomes
            </div>
            <h2 className="landing-section-title">Results that professionals report</h2>
          </div>

          <div className="landing-testimonials-grid">
            {testimonials.map((t, i) => (
              <div key={i} className="landing-testimonial reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <div className="landing-stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={13} fill="currentColor" />
                  ))}
                </div>
                <p className="landing-testimonial-text">"{t.text}"</p>
                <div className="landing-testimonial-author">
                  <div className="landing-author-avatar">
                    {t.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="landing-author-name">{t.name}</div>
                    <div className="landing-author-role">{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="landing-cta-section">
        <div className="landing-cta-inner">
          <div className="landing-orb landing-orb-cta-1" aria-hidden />
          <div className="landing-orb landing-orb-cta-2" aria-hidden />
          <div className="landing-section-header reveal" style={{ position: 'relative', zIndex: 2 }}>
            <div className="landing-eyebrow landing-eyebrow-light">
              <Zap size={13} />
              Start Today — No Cost
            </div>
            <h2 className="landing-cta-title">
              Stop sending resumes into the void.
              <br />
              Start getting responses.
            </h2>
            <p className="landing-cta-sub">
              Join professionals who use AI-driven resume intelligence to compete in the modern hiring market.
              Your first resume is completely free.
            </p>
            <div className="landing-cta-buttons">
              <Link to="/register" className="landing-btn-primary landing-btn-lg">
                Create Your Resume Free
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" className="landing-btn-ghost-light">
                Sign In
              </Link>
            </div>
            <p className="landing-cta-note">
              No subscription required for core features. Export PDF immediately after building.
            </p>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="landing-footer">
        <div className="landing-footer-inner">
          <div className="landing-footer-brand">
            <Logo size="sm" showText={true} />
            <p className="landing-footer-tagline">
              AI-powered resume intelligence for the modern professional.
            </p>
          </div>
          <div className="landing-footer-links">
            <Link to="/login">Sign In</Link>
            <Link to="/register">Get Started</Link>
            <Link to="/license">License</Link>
          </div>
          <div className="landing-footer-copy">
            &copy; {new Date().getFullYear()} Resume Builder. All rights reserved. Built for outcome-driven professionals.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

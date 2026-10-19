"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";
import DownloadApp from "./DownloadApp";
import WalkthroughVideo from "@/components/WalkthroughVideo";
import { useAppAuth } from "@/hooks/useAppAuth";
import styles from "@/styles/Home.module.css";

const steps = [
  ["Name an intention", "Start with something that matters to you. Choose one to five practices, with AI to help you draft them."],
  ["Record the day", "Mark what happened. A small daily check-in gives your intention a visible place in your life."],
  ["See what continues", "Return to your record. Notice repetition, pauses, and the shape of your practice over time."],
];
const principles = [
  ["Continuity", "Small actions, repeated over time. A streak is the trace they leave."],
  ["Clarity", "Days and practices line up in a quiet grid, making patterns easier to see."],
  ["Honesty", "Record both presence and absence. The ledger holds the facts without judgment."],
];
const books = [
  ["The Compound Effect", "Darren Hardy", "Small actions accumulate."],
  ["Atomic Habits", "James Clear", "Give repetition a structure."],
  ["Stick With It", "Sean Young", "Make follow-through sustainable."],
];

function LedgerPreview() {
  return (
    <figure className={styles.preview}>
      <div className={styles.previewHeading}><span className={styles.eyebrow}>A week of practice</span><span className={styles.example}>Example</span></div>
      <p className={styles.previewTitle}>Make room for what matters.</p>
      <div className={styles.sampleGrid} aria-hidden="true">
        <span />{["Sleep", "Meditate", "Train"].map(name => <span className={styles.column} key={name}>{name}</span>)}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, row) => (
          <div className={styles.sampleRow} key={day}>
            <span className={styles.day}>{day}</span>
            {[0, 1, 2].map(col => {
              const missed = (row === 2 && col === 1) || (row === 4 && col === 0);
              const empty = row === 6;
              return <span key={col} className={`${styles.cell} ${empty ? styles.empty : missed ? styles.missed : styles.done}`}>{!empty && (missed ? <X size={16} /> : <Check size={16} />)}</span>;
            })}
          </div>
        ))}
      </div>
      <figcaption className={styles.caption}>Each mark is a moment of practice.<br />Together, they become a record.</figcaption>
    </figure>
  );
}

export default function NewIntro() {
  const { user } = useAppAuth();
  const homeRef = useRef(null);
  useEffect(() => {
    const home = homeRef.current;
    const scroller = home?.closest(".main-layout-landing");
    if (!home || !scroller) return;
    const sections = [...home.querySelectorAll("section")];
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const visible = new Set(sections);
    let frame = 0;
    const paint = () => {
      frame = 0;
      if (preference.matches) return;
      const bounds = scroller.getBoundingClientRect();
      const height = scroller.clientHeight;
      visible.forEach(section => {
        const rect = section.getBoundingClientRect();
        const top = rect.top - bounds.top;
        const bottom = rect.bottom - bounds.top;
        const entering = Math.min(1, Math.max(0, (height - top) / (height * 0.28)));
        const leaving = Math.min(1, Math.max(0, bottom / (height * 0.24)));
        section.style.setProperty("--reveal-opacity", String(Math.min(entering, leaving)));
        section.style.setProperty("--reveal-offset", `${(1 - entering) * 24}px`);
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) visible.add(entry.target);
        else {
          visible.delete(entry.target);
          entry.target.style.setProperty("--reveal-opacity", "0");
        }
      });
      schedule();
    }, { root: scroller, rootMargin: "80px 0px" });
    const reset = () => {
      sections.forEach(section => {
        section.style.removeProperty("--reveal-opacity");
        section.style.removeProperty("--reveal-offset");
      });
      if (!preference.matches) schedule();
    };
    sections.forEach(section => observer.observe(section));
    scroller.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    preference.addEventListener("change", reset);
    schedule();
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      scroller.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      preference.removeEventListener("change", reset);
    };
  }, []);
  const startHref = user ? "/panel" : "/sign-up";
  const startText = user ? "Open your ledger" : "Start your practice";
  return (
    <div className={styles.home} ref={homeRef}>
      <nav className={styles.nav} aria-label="Home navigation">
        <Link href="/" className={styles.brand} aria-label="Streaker home"><Image src="/streaker-logo.png" alt="" width={36} height={36} priority /><span>Streaker<span className={styles.beta}>BETA</span></span></Link>
        <div className={styles.navLinks}><a href="#walkthrough-title">Watch the guide</a><Link href="/about">About</Link><Link href={user ? "/panel" : "/sign-in"}>{user ? "Your ledger" : "Log in"}<ArrowRight size={15} aria-hidden="true" /></Link></div>
      </nav>
      <section className={styles.hero} aria-labelledby="home-title">
        <div>
          <p className={styles.eyebrow}>A quiet place for daily practice</p>
          <h1 id="home-title">Give your<br />intention a record.</h1>
          <p className={styles.lead}>Choose what matters. Show up. See the pattern that grows from the things you do each day.</p>
          <div className={styles.actions}><Link className={styles.primary} href={startHref}>{startText}<ArrowRight size={18} aria-hidden="true" /></Link><a className={styles.textLink} href="#how-it-works">How it works</a></div>
          <p className={styles.heroNote}>One to five practices. One day at a time.</p>
        </div>
        <LedgerPreview />
      </section>
      <section className={styles.introduction} aria-labelledby="what-title">
        <p className={styles.eyebrow}>What this is</p>
        <h2 id="what-title">A mirror of your practice over time.</h2>
        <p>Streaker is a daily discipline ledger. It gives your intentions a simple structure and keeps an honest record of what you actually practice.</p>
      </section>
      <section id="how-it-works" className={styles.section} aria-labelledby="how-title">
        <p className={styles.eyebrow}>From intention to action</p>
        <h2 id="how-title">Turning intention into a record.</h2>
        <ol className={styles.steps}>{steps.map(([title, description], i) => <li key={title}><span className={styles.number}>0{i + 1}</span><h3>{title}</h3><p>{description}</p></li>)}</ol>
      </section>
      <WalkthroughVideo />
      <section className={`${styles.section} ${styles.displayFeature}`} aria-labelledby="display-title">
        <div className={styles.displayCopy}>
          <p className={styles.eyebrow}>Your practice, in view</p>
          <h2 id="display-title">A quiet place<br />in your everyday space.</h2>
          <p>Keep your record nearby on a compatible display. A wooden e-paper frame is one way to give your daily practice a place beyond your phone.</p>
          <ol className={styles.displaySteps}>
            <li><span>01</span><div><h3>Copy your display link</h3><p>Find it in Profile &amp; settings. The image shows your main panel.</p></div></li>
            <li><span>02</span><div><h3>Open it on your screen</h3><p>Use a device that supports a web browser or an image URL.</p></div></li>
            <li><span>03</span><div><h3>Keep the image current</h3><p>Refresh to see new marks, or set up automatic refresh on your device.</p></div></li>
          </ol>
          <Link className={styles.textLink} href={user ? "/profile" : "/sign-in"}>Find your display link<ArrowRight size={16} aria-hidden="true" /></Link>
          <p className={styles.displayNote}>Anyone with your display link can view its image.</p>
        </div>
        <figure className={styles.displayFigure}>
          <Image src="/images/display/streaker-oak-studio.jpg" alt="Streaker daily practice grid with ticks and crosses in a wooden e-paper frame and stand" width={896} height={1200} sizes="(max-width: 700px) 90vw, 45vw" />
          <figcaption>One way to display your practice. Image based on a real Streaker setup.</figcaption>
        </figure>
      </section>
      <section className={`${styles.section} ${styles.method}`} aria-labelledby="method-title">
        <div className={styles.sectionHeading}><div><p className={styles.eyebrow}>The method</p><h2 id="method-title">The structure beneath<br />the surface.</h2></div><Link className={styles.textLink} href="/about">Explore the philosophy<ArrowRight size={16} aria-hidden="true" /></Link></div>
        <div className={styles.principles}>{principles.map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div>
      </section>
      <section className={styles.section} aria-labelledby="sources-title">
        <p className={styles.eyebrow}>Sources of method</p>
        <h2 id="sources-title">Ideas behind the practice.</h2>
        <p className={styles.sectionIntro}>Three works that inform the approach to repetition and continuity.</p>
        <div className={styles.books}>{books.map(([title, author, text], i) => <article key={title}><span className={styles.bookIndex}>0{i + 1} / REFERENCE</span><h3>{title}</h3><p className={styles.author}>{author}</p><p>{text}</p></article>)}</div>
        <Link className={styles.textLink} href="/about">Read more about the method and its sources<ArrowRight size={16} aria-hidden="true" /></Link>
      </section>
      <section className={styles.closing} aria-labelledby="start-title"><p className={styles.eyebrow}>Begin with today</p><h2 id="start-title">One intention.<br />A place to return to.</h2><Link className={styles.primary} href={startHref}>{startText}<ArrowRight size={18} aria-hidden="true" /></Link><div className={styles.install}><DownloadApp /></div></section>
    </div>
  );
}

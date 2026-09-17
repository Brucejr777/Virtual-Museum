import { Link } from 'react-router-dom';
import { PageHero, SectionHeading } from '../components/UI';

export function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Our museum" title="About the Meridian Archive" description="Our museum" image="https://commons.wikimedia.org/wiki/Special:Redirect/file/Van%20Gogh%20-%20Starry%20Night%20-%20Google%20Art%20Project.jpg?width=1280" imageAlt="A painted night sky" />
      <section className="section about-mission">
        <div className="section-inner mission-statement"><p className="eyebrow">Our mission</p><h2>To make looking feel like a place you can enter.</h2><p>The Meridian Archive is a fictional virtual museum designed as a working model for digital interpretation. We bring together public-domain-inspired imagery, structured collection data, and editorial storytelling so that a visit can feel as considered as a walk through a physical gallery.</p></div>
      </section>
      <section className="section section-tinted">
        <div className="section-inner about-story-grid">
          <div><p className="eyebrow">Our story</p><h2>A museum without walls</h2></div>
          <div><p>The archive began as a simple question: what if a museum could keep the quiet, the pacing, and the sense of discovery of a gallery while becoming available to anyone with an internet connection? The result is a responsive, accessible website where every route is a room and every object record is an invitation to look more closely.</p><p>Our content is deliberately fictional and clearly identified as such. Image sources are drawn from public-domain and open-access collections, while the data model is designed to be replaced by real institutional records.</p></div>
        </div>
      </section>
      <section className="section">
        <div className="section-inner about-columns">
          <div><p className="eyebrow">Curatorial approach</p><h2>Context before spectacle.</h2><p>We favor slow looking over endless scrolling. Each exhibition is built around a question, each object record includes material and provenance fields, and each page leaves space for uncertainty.</p></div>
          <div><p className="eyebrow">Virtual museum concept</p><h2>Designed for the way people wander.</h2><p>Search, favorites, filters, and timeline navigation work together without turning the museum into a database. The interface is a guide, not a gatekeeper.</p></div>
          <div><p className="eyebrow">Access &amp; care</p><h2>Built to be usable by more people.</h2><p>Semantic landmarks, keyboard-operable controls, descriptive alt text, responsive layouts, and reduced-motion support are part of the exhibition design from the beginning.</p></div>
        </div>
      </section>
      <section className="section section-tinted contributors-section">
        <div className="section-inner">
          <SectionHeading eyebrow="Contributors" title="Made by people who love museums" description="This prototype brings together editorial design, frontend engineering, collection thinking, and a respect for the public domain." />
          <div className="contributor-grid"><div><strong>EV</strong><span>Elara Voss<br /><small>Curatorial direction</small></span></div><div><strong>MR</strong><span>Mara Ito<br /><small>Interpretation</small></span></div><div><strong>JR</strong><span>Jonas Reed<br /><small>Digital experience</small></span></div><div><strong>NO</strong><span>Nia Okonkwo<br /><small>Research &amp; access</small></span></div></div>
        </div>
      </section>
      <section className="section contact-section" id="contact">
        <div className="section-inner contact-grid"><div><p className="eyebrow">Contact</p><h2>Write to the archive.</h2><p>For questions about this prototype, accessibility, image sources, or data structure, reach the Meridian team.</p></div><div className="contact-details"><a href="mailto:hello@meridianarchive.example">hello@meridianarchive.example</a><span>Virtual reading room<br />Open every day</span><Link className="button button-dark" to="/search">Search the archive</Link></div></div>
      </section>
    </>
  );
}

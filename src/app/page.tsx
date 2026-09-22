import { Header } from "@/components/Header";
import { RevealObserver } from "@/components/RevealObserver";
import {
  education,
  independentAi,
  projects,
  site,
  skills,
} from "@/data/content";

export default function HomePage() {
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Header />
      <RevealObserver />

      <main id="main">
        <section className="hero" id="top" aria-label="Introduction">
          <div className="hero-plane" aria-hidden="true" />
          <div className="shell hero-inner">
            <p className="hero-kicker">{site.title}</p>
            <h1 className="hero-name">{site.name}</h1>
            <p className="hero-lede">
              Building intelligent systems at the intersection of data science
              and AI engineering — from predictive models to retrieval-grounded
              agents.
            </p>
            <div className="hero-actions">
              <a className="btn btn-primary" href="#projects">
                View projects
              </a>
              <a
                className="btn btn-ghost"
                href={site.resumePath}
                target="_blank"
                rel="noreferrer"
              >
                Download resume
              </a>
              <a className="btn btn-ghost" href={`mailto:${site.email}`}>
                Contact
              </a>
              <a className="btn btn-ghost" href="#twin">
                Ask the twin
              </a>
            </div>
          </div>
        </section>

        <section className="section" id="about">
          <div className="shell">
            <div className="section-head reveal">
              <p className="section-label">About</p>
              <h2 className="section-title">Focused on applied ML and AI systems</h2>
            </div>
            <div className="about-grid reveal">
              <div className="about-text">
                <p>{site.summary}</p>
                <p>
                  Currently in the Dual-Track program at {education.school}, pursuing
                  a B.S. in Data Science with a Biology concentration and Mathematics
                  minor alongside an M.S. in Applied Statistics and Data Science
                  (expected {education.expected}; GPA {education.gpa}).
                </p>
              </div>
              <div className="about-meta">
                <div className="meta-row">
                  <span className="meta-label">Location</span>
                  <p className="meta-value">{site.location}</p>
                </div>
                <div className="meta-row">
                  <span className="meta-label">Email</span>
                  <p className="meta-value">
                    <a href={`mailto:${site.email}`}>{site.email}</a>
                  </p>
                </div>
                <div className="meta-row">
                  <span className="meta-label">GitHub</span>
                  <p className="meta-value">
                    <a href={site.github} target="_blank" rel="noreferrer">
                      Project Portfolio
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="education">
          <div className="shell">
            <div className="section-head reveal">
              <p className="section-label">Education</p>
              <h2 className="section-title">Academic foundation</h2>
            </div>
            <div className="edu-block reveal">
              <div className="edu-top">
                <h3 className="edu-school">{education.school}</h3>
                <p className="edu-program">{education.program}</p>
                <div className="edu-meta">
                  <span>
                    <strong>Expected:</strong> {education.expected}
                  </span>
                  <span>
                    <strong>Location:</strong> {education.location}
                  </span>
                  <span>
                    <strong>GPA:</strong> {education.gpa}
                  </span>
                </div>
              </div>
              <div className="edu-lists">
                <div className="edu-list">
                  <h4>Current coursework</h4>
                  <div className="edu-sublist">
                    <h5>Coursework</h5>
                    <ul>
                      {education.currentCoursework.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="edu-sublist">
                    <h5>Independent studies</h5>
                    <ul>
                      {education.currentIndependentStudies.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="edu-list">
                  <h4>Upcoming coursework</h4>
                  <div className="edu-sublist">
                    <h5>Coursework</h5>
                    <ul>
                      {education.upcomingCoursework.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="edu-sublist">
                    <h5>Independent studies</h5>
                    <ul>
                      {education.upcomingIndependentStudies.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="edu-list">
                  <h4>Certifications</h4>
                  <ul>
                    {education.certifications.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="skills">
          <div className="shell">
            <div className="section-head reveal">
              <p className="section-label">Skills</p>
              <h2 className="section-title">Core toolkit</h2>
              <p className="section-copy">
                From languages and statistical tooling through deep learning and agent frameworks.
              </p>
            </div>
            <ul className="skills-list reveal">
              {skills.map((group) => (
                <li className="skill-row" key={group.label}>
                  <p className="skill-label">{group.label}</p>
                  <p className="skill-items">{group.items.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="section" id="projects">
          <div className="shell">
            <div className="section-head reveal">
              <p className="section-label">Projects</p>
              <h2 className="section-title">Selected work</h2>
              <p className="section-copy">
                Full write-ups and code live on dedicated branches in the Project
                Portfolio repository.
              </p>
            </div>
            <div className="projects">
              {projects.map((project, index) => (
                <article className="project reveal" key={project.id} id={project.id}>
                  <span className="project-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-sub">{project.subtitle}</p>
                  <div className="project-body">
                    <ul className="project-bullets">
                      {project.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                    <p>
                      <strong>Techniques:</strong> {project.techniques}
                    </p>
                    <p>
                      <strong>Results:</strong> {project.result}
                    </p>
                  </div>
                  <a
                    className="project-link"
                    href={project.branchUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View branch →
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="experience">
          <div className="shell">
            <div className="section-head reveal">
              <p className="section-label">AI experience</p>
              <h2 className="section-title">Independent LLM &amp; agent work</h2>
              <p className="section-copy">
                Additional projects listed on the resume under LLM &amp; Agentic AI.
              </p>
            </div>
            <ul className="note-list reveal">
              {independentAi.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="contact" id="contact">
          <div className="shell contact-inner reveal">
            <p className="section-label">Contact</p>
            <h2 className="section-title">Let&apos;s connect</h2>
            <p className="section-copy">
              Reach out by email, or browse the project repository on
              GitHub.
            </p>
            <div className="contact-actions">
              <a className="btn btn-primary" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              <a
                className="btn btn-ghost"
                href={site.resumePath}
                target="_blank"
                rel="noreferrer"
              >
                View resume
              </a>
              <a
                className="btn btn-ghost"
                href={site.github}
                target="_blank"
                rel="noreferrer"
              >
                GitHub portfolio
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-row">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <a href={site.github} target="_blank" rel="noreferrer">
            github.com/lmn4121/Project-Portfolio
          </a>
        </div>
      </footer>
    </>
  );
}

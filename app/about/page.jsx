export default function AboutPage() {
  return (
    <main className="bento-page">
      <div className="bento-grid">
        
        {/* Header Block spans top left */}
        <div className="bento-card bento-header">
          <h1>Founder's Club.</h1>
          <p className="highlight">It’s a curated space for people who take initiative.</p>
        </div>

        {/* Section 1 */}
        <div className="bento-card">
          <p className="b-label">What this is</p>
          <p>
            A network of individuals who take initiative. We're looking for people who are willing to try, open to ideas, and comfortable figuring things out.
          </p>
        </div>

        {/* Core Belief explicitly moved up for mobile stream */}
        <div className="bento-card bento-hero">
          <p className="b-label">Core Belief</p>
          <h2 className="hero-text">
            When the right people are in the same room, things happen.
          </h2>
        </div>

        {/* Section 2 */}
        <div className="bento-card bento-tall">
          <p className="b-label">Why this exists</p>
          <p>Most spaces today are:</p>
          <ul>
            <li>too passive</li>
            <li>too noisy</li>
            <li>or too focused on just learning</li>
          </ul>
          <p>
            Very few are designed for people who actually want to do things, find others like them, and grow by participating.
          </p>
        </div>

        {/* Section 4 */}
        <div className="bento-card bento-tall">
          <p className="b-label">Who this is for</p>
          <p>We’re looking for individuals who can:</p>
          <ul>
            <li>support and strengthen an ecosystem</li>
            <li>contribute to ideas and execution</li>
            <li>collaborate with others</li>
          </ul>
          <p>What matters is <strong>how you approach things</strong>, not your title.</p>
        </div>

        {/* Section 5 */}
        <div className="bento-card bento-tall">
          <p className="b-label">What you’ll find</p>
          <ul>
            <li>your cofounder</li>
            <li>your future team</li>
            <li>someone who challenges your thinking</li>
            <li>people who push you to act</li>
            <li>the idea you end up building</li>
          </ul>
        </div>

        {/* Section 6 */}
        <div className="bento-card bento-wide">
          <p className="b-label">The direction</p>
          <p>
            The goal is to build something smaller, sharper, and more meaningful: A network where people repeatedly come together to create things that matter. That’s how real ecosystems form.
          </p>
        </div>

        {/* Section 7 */}
        <div className="bento-card">
          <p className="b-label">If you’re here</p>
          <p>
            Don’t just observe. Talk to people. Share what you’re working on. Try things. The value of this space is what you do with it.
          </p>
        </div>
        
      </div>
    </main>
  );
}

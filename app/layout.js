import "./globals.css";

export const metadata = {
  title: "Founder's Club Intake",
  description: "Private application intake for Founder's Club.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="global-nav">
          <div className="nav-brand">FC</div>
          <div className="nav-links">
            <a href="/">QA</a>
            <a href="/about">Know</a>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}

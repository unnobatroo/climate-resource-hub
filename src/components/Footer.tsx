const footerLinks = [
  {
    label: "Source",
    href: "https://github.com/unnobatroo/climate-resource-hub",
    icon: "m9 18-6-6 6-6m6 0 6 6-6 6"
  },
  {
    label: "Suggest a resource",
    href: "https://github.com/unnobatroo/climate-resource-hub/issues/new",
    icon: "M12 8v8m-4-4h8m5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
  },
  {
    label: "Contribute",
    href: "https://github.com/unnobatroo/climate-resource-hub/compare",
    icon: "M6 3v12m0 0a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm12-12v4a4 4 0 0 1-4 4H9m9 4a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
  }
] as const;

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <div>
          <strong>Climate Resource Hub</strong>
          <p>Curated by <a href="https://jalols.page">Jaloliddin Ismailov</a> with the YOUNGO Science Working Group.</p>
        </div>
        <nav aria-label="Project links">
          {footerLinks.map((link) => (
            <a href={link.href} key={link.href}>
              <svg className="footer-link-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d={link.icon} />
              </svg>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}

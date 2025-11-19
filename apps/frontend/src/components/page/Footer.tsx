function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {currentYear} My Blog. All rights reserved.</p>
        <div className="footer-links">
          <a
            href="https://github.com/mariogarcia79/"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
          >
            GitHub
          </a>
          {/*
          <a href="mailto:contact@example.com" className="link">
            Contact
          </a>
          */}
        </div>
      </div>
    </footer>
  );
}

export default Footer;

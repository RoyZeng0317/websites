import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer>
      <div className={styles.footer}>
        <div className={styles.footerTop}>
          <div className={styles.section}>
            <span className={styles.sectionLabel}>Contact</span>
            <span className={styles.link}>Email: boyud9.5@yahoo.com</span>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Account</span>
            <a href="#" className={styles.link}>My Account</a>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>About Us</span>
            <a href="#" className={styles.link}>Our Business</a>
            <a href="#" className={styles.link}>Careers</a>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Other Links</span>
            <a href="#" className={styles.link}>GEPT</a>
            <a href="#" className={styles.link}>BESTEP</a>
            <a href="#" className={styles.link}>IELTS</a>
            <a href="#" className={styles.link}>TOEFL</a>
          </div>

          <div className={styles.section}>
            <span className={styles.sectionLabel}>Follow Us</span>
            <div className={styles.social}>
              <a href="#" aria-label="Facebook"><i className="fa-brands fa-facebook" /></a>
              <a href="#" aria-label="X/Twitter"><i className="fa-brands fa-x-twitter" /></a>
              <a href="#" aria-label="Instagram"><i className="fa-brands fa-instagram" /></a>
              <a href="#" aria-label="YouTube"><i className="fa-brands fa-youtube" /></a>
              <a href="mailto:boyud9.5@yahoo.com" aria-label="Email"><i className="fa-solid fa-envelope" /></a>
            </div>
          </div>
        </div>

        <div className={styles.copyright}>
          Copyright &copy; 2026
          <a href="https://royzeng0317.github.io/HTML/en-us/index.html">Roy Zeng</a>.
          All Rights Reserved. Version: 2.1.8
        </div>
      </div>
    </footer>
  );
}

export const site = {
  author: 'Dinesh Karki',
  email: 'dev.dinesh.karki@gmail.com',
  github: 'https://github.com/DineshKarki10',
  linkedin: 'https://www.linkedin.com/in/dinesh-karki-',
  /**
   * Portrait shown in the hero. Drop the image file into `public/` and point
   * this at it (for example '/dinesh-karki.jpg'). Until the file exists the
   * hero falls back to the initials monogram, so the layout never breaks.
   */
  portrait: '/dinesh-karki.jpg',
  /**
   * Formspree form endpoint. Replace `your-form-id` with the id from your
   * Formspree dashboard (https://formspree.io/f/<your-form-id>).
   * While the placeholder is still present the contact form is shown in an
   * "unconfigured" state and submissions are refused rather than silently lost.
   */
  formspreeEndpoint: 'https://formspree.io/f/mvkgvjwl',
};

export const isFormspreeConfigured = !site.formspreeEndpoint.includes('your-form-id');

export const socialLinks = [
  { label: 'GitHub', href: site.github },
  { label: 'LinkedIn', href: site.linkedin },
  { label: 'Email', href: `mailto:${site.email}` },
];

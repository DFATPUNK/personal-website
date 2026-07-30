export const siteConfig = {
  name: 'Jérémy Brunet',
  title: 'Jérémy Brunet | Technical Portfolio',
  description:
    'A minimal technical portfolio for essays, demos, automation systems, AI workflows, and practical software architecture.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://jeremybrunet.com',
  demosBaseUrl: 'https://demos.jeremybrunet.com',
  navigation: [
    { href: '/', label: 'About' },
    { href: '/essays', label: 'Essays' },
    { href: '/demos', label: 'Demos' },
    { href: '/contact', label: 'Contact' },
  ],
  links: {
    github: 'https://github.com/DFATPUNK',
    linkedin: 'https://www.linkedin.com/in/j%C3%A9r%C3%A9my-brunet-446007b4/',
    personalWebsiteRepository: 'https://github.com/DFATPUNK/personal-website',
    demosRepository: 'https://github.com/DFATPUNK/demos',
  },
} as const

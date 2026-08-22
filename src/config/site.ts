export interface NavLink {
  name: string
  href: string
}

export interface SocialLink {
  name: string
  href: string
  icon?: string
}

export const siteConfig = {
  name: "Raman",
  title: "Raman — 3D Creator",
  tagline: "3D Creator & Visual Designer",
  email: "mailto:ramandeepkamboj4574@gmail.com",
  contactEmailDisplay: "ramandeepkamboj4574@gmail.com",
  whatsapp: "+91 8505002058",
  whatsappUrl: "https://wa.me/918505002058",
  portraitPath: "/raman-hero.webp",
  
  hero: {
    greeting: "HI, I'M RAMAN",
    leftBio: "A 3D CREATOR DRIVEN BY CRAFTING STRIKING AND UNFORGETTABLE DIGITAL EXPERIENCES.",
    ctaText: "CONTACT ME",
  },

  about: {
    heading: "ABOUT ME",
    paragraph:
      "I create immersive 3D visuals, digital experiences, and striking designs with a strong focus on creativity, detail, and visual storytelling. I enjoy turning ideas into memorable experiences that help brands, products, and people stand out. Let's build something incredible together.",
    ctaText: "CONTACT ME",
  },

  navLinks: [
    { name: "About", href: "#about" },
    { name: "Price", href: "#services" }, // Price points to services section as per spec
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ] as NavLink[],

  socials: [
    { name: "ArtStation", href: "https://artstation.com" },
    { name: "Instagram", href: "https://instagram.com" },
    { name: "X (Twitter)", href: "https://x.com" },
    { name: "LinkedIn", href: "https://linkedin.com" },
    { name: "GitHub", href: "https://github.com" },
  ] as SocialLink[],
}

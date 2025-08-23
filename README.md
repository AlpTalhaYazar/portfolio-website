# Alp Talha Yazar - Portfolio Website

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS, showcasing my experience as a Backend Developer and Full Stack Engineer.

## 🌟 Features

- **Modern Design**: Clean, professional design with smooth animations
- **Fully Responsive**: Optimized for all screen sizes and devices
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Performance Optimized**: Fast loading with Next.js 15 optimizations
- **SEO Friendly**: Comprehensive meta tags, sitemap, and robots.txt
- **Type Safe**: Built with TypeScript for better developer experience
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React (with custom SVG icons)
- **Forms**: React Hook Form with Zod validation
- **Deployment**: Ready for Vercel, Netlify, or any static hosting

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd portfolio-website
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router
│   ├── globals.css      # Global styles
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Home page
│   ├── not-found.tsx    # 404 page
│   ├── sitemap.ts       # Dynamic sitemap
│   └── robots.txt       # Robots file
├── components/          # React components
│   ├── Header.tsx       # Navigation header
│   ├── Hero.tsx         # Hero section
│   ├── About.tsx        # About section
│   ├── Experience.tsx   # Work experience
│   ├── Skills.tsx       # Technical skills
│   ├── Projects.tsx     # Featured projects
│   ├── Contact.tsx      # Contact form
│   ├── Footer.tsx       # Site footer
│   └── ScrollToTop.tsx  # Scroll to top button
├── lib/                 # Utility functions
│   ├── data.ts          # Portfolio data
│   └── utils.ts         # Helper functions
└── types/               # TypeScript definitions
    └── index.ts         # Type definitions
```

## 🎨 Customization

### Update Personal Information

1. **Contact Information**: Update email, phone, and location in `src/lib/data.ts`
2. **Social Links**: Modify GitHub, LinkedIn, and other social links
3. **Experience**: Add or modify work experience entries
4. **Projects**: Update featured projects with your own work
5. **Skills**: Adjust skill categories and proficiency levels

### Update SEO & Metadata

1. **Domain**: Replace `your-domain.com` in `src/app/layout.tsx` and `src/app/sitemap.ts`
2. **Social Handles**: Update Twitter handle in metadata
3. **Verification Codes**: Add Google Search Console verification code

### Styling

The website uses Tailwind CSS with custom CSS variables for theming. Colors and spacing can be customized in:

- `src/app/globals.css` - CSS variables and custom styles
- `tailwind.config.ts` - Tailwind configuration (if needed)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically on push

### Other Platforms

1. Build the project:

```bash
pnpm build
```

2. Deploy the `out` folder (if using static export) or run the production server

## 📝 Content Guidelines

### Experience Section

- Use clear, achievement-focused descriptions
- Include specific technologies and metrics
- Highlight business impact and technical accomplishments

### Projects Section

- Showcase diverse technical skills
- Include key features and technologies used
- Emphasize problem-solving and innovation

### Skills Section

- Organize by categories (Backend, Frontend, Database, Tools)
- Be honest about proficiency levels
- Include both technical and soft skills

## 🔧 Performance Optimizations

- **Image Optimization**: WebP and AVIF format support
- **Code Splitting**: Automatic with Next.js App Router
- **Font Optimization**: Using Next.js font optimization
- **Bundle Analysis**: Optimized imports for Lucide React and Framer Motion
- **Security Headers**: XSS protection and content security

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome! Feel free to:

1. Fork the project
2. Create a feature branch
3. Submit a pull request

## 📞 Contact

**Alp Talha Yazar**

- Email: alptalhayazar@gmail.com
- LinkedIn: [linkedin.com/in/alptalhayazar](https://linkedin.com/in/alptalhayazar)
- GitHub: [github.com/alptalhayazar](https://github.com/alptalhayazar)

---

_Built with ❤️ using Next.js, TypeScript & Tailwind CSS_

# Alp Talha Yazar - Portfolio Website

A modern, responsive portfolio website built with Next.js 15, TypeScript, and Tailwind CSS, showcasing my experience as a Backend Developer and Full Stack Engineer.

## 🌟 Features

- **Modern Design**: Clean, professional design with smooth animations and theme effects
- **Fully Responsive**: Optimized for all screen sizes and devices
- **Multi-language Support**: Internationalization (i18n) with English, Spanish, and Turkish
- **Dark/Light Mode**: Advanced theme system with automatic switching and custom effects
- **Contact System**: Secure contact form with email integration using Nodemailer
- **Security Features**: CSRF protection, rate limiting, spam detection, and security headers
- **Performance Optimized**: Fast loading with Next.js 15 and Turbopack optimizations
- **SEO Friendly**: Comprehensive meta tags, sitemap, structured data, and robots.txt
- **Type Safe**: Built with TypeScript and Zod validation for better developer experience
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Analytics Integration**: Google Analytics support with privacy-focused implementation

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router with Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 with custom CSS variables
- **Animations**: Framer Motion
- **Icons**: Lucide React (with custom SVG icons)
- **Forms**: React Hook Form with Zod validation
- **Email**: Nodemailer for contact form functionality
- **Security**: Custom middleware with CSRF protection and rate limiting
- **Internationalization**: Custom i18n system with context API
- **Analytics**: Google Analytics integration
- **Deployment**: Vercel (production deployment)

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/alptalhayazar/portfolio-website.git
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
- `pnpm build` - Build for production with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm vercel-build` - Build specifically for Vercel deployment
- `pnpm type-check` - Run TypeScript type checking without emitting files

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── contact/       # Contact form endpoint
│   │   ├── csrf-token/    # CSRF token endpoint
│   │   └── health/        # Health check endpoint
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   ├── not-found.tsx      # 404 page
│   ├── sitemap.ts         # Dynamic sitemap
│   ├── robots.txt         # Robots file
│   └── favicon.ico        # Site favicon
├── components/            # React components (organized by purpose)
│   ├── analytics/         # Analytics components
│   │   └── GoogleAnalytics.tsx
│   ├── layout/            # Layout-related components
│   │   ├── Header.tsx     # Navigation header
│   │   ├── Footer.tsx     # Site footer
│   │   └── ScrollToTop.tsx
│   ├── pages/             # Page section components
│   │   ├── Hero.tsx       # Hero section
│   │   ├── About.tsx      # About section
│   │   ├── Experience.tsx # Work experience
│   │   ├── Skills.tsx     # Technical skills
│   │   ├── Projects.tsx   # Featured projects
│   │   ├── Contact.tsx    # Contact section
│   │   ├── ContactForm.tsx # Contact form component
│   │   └── ContactInfo.tsx # Contact information
│   ├── theme/             # Theme and visual effects
│   │   ├── ThemeProvider.tsx # Theme context provider
│   │   ├── StarField.tsx  # Background star animation
│   │   ├── MatrixRain.tsx # Matrix-style animation
│   │   └── ForceGlow.tsx  # Glowing effect component
│   ├── ui/                # Reusable UI components
│   │   ├── ThemeToggle.tsx # Dark/light mode toggle
│   │   ├── LanguageToggle.tsx # Language switcher
│   │   ├── LoadingSpinner.tsx # Loading indicator
│   │   ├── HologramCard.tsx # 3D card effect
│   │   └── LightsaberButton.tsx # Animated button
│   └── utils/             # Utility components
│       ├── ErrorBoundary.tsx # Error handling
│       ├── StructuredData.tsx # SEO structured data
│       └── LazyWrapper.tsx # Lazy loading wrapper
├── hooks/                 # Custom React hooks
│   ├── useContactSubmission.ts # Contact form handling
│   └── useCSRFSecurity.ts # CSRF token management
├── lib/                   # Utility functions and configurations
│   ├── data.ts           # Portfolio data (experiences, projects, skills)
│   ├── utils.ts          # Helper functions
│   ├── security.ts       # Security utilities
│   ├── performance.ts    # Performance monitoring
│   ├── logger.ts         # Logging utilities
│   ├── email-templates/  # Email template system
│   │   ├── builder.ts    # Email builder
│   │   ├── components.ts # Email components
│   │   └── styles.ts     # Email styles
│   └── i18n/             # Internationalization
│       ├── config.ts     # i18n configuration
│       ├── context.tsx   # Language context
│       ├── proxy.ts      # Translation proxy
│       └── translations/ # Translation files
│           ├── en.ts     # English translations
│           ├── es.ts     # Spanish translations
│           └── tr.ts     # Turkish translations
├── middleware.ts          # Next.js middleware (security, i18n)
├── types/                # TypeScript definitions
│   ├── index.ts          # General type definitions
│   └── contact.ts        # Contact form types
└── test/                 # Test files and utilities
```

## 🎨 Customization

### Update Personal Information

1. **Contact Information**: Update email, phone, and location in `src/lib/data.ts`
2. **Social Links**: Modify GitHub, LinkedIn, and other social links in the socialLinks array
3. **Experience**: Add or modify work experience entries in the experiences array
4. **Projects**: Update featured projects with your own work in the projects array
5. **Skills**: Adjust skill categories and proficiency levels in the skills array
6. **Translations**: Update personal information in all language files (`src/lib/i18n/translations/`)

### Update SEO & Metadata

1. **Domain**: Update domain references to `www.alptalha.dev` in `src/app/layout.tsx` and `src/app/sitemap.ts`
2. **Social Handles**: Update Twitter handle in metadata
3. **Verification Codes**: Add Google Search Console verification code
4. **Analytics**: Configure Google Analytics tracking ID in `src/components/analytics/GoogleAnalytics.tsx`
5. **Structured Data**: Update personal and professional information in `src/components/utils/StructuredData.tsx`

### Styling

The website uses Tailwind CSS v4 with custom CSS variables for theming. Colors and spacing can be customized in:

- `src/app/globals.css` - CSS variables and custom styles
- `tailwind.config.ts` - Tailwind configuration (if needed)

### Contact Form Setup

The contact form uses Gmail SMTP for email delivery with automatic configuration:

1. **Gmail Configuration**: Automatically configured for Gmail service (smtp.gmail.com:587) with TLS
2. **Environment Variables**: Uses `GMAIL_USER`, `GMAIL_APP_PASSWORD`, and optional `EMAIL_TO`
3. **Security**: The form includes CSRF protection, rate limiting, spam detection, and origin verification
4. **Email Templates**: Professional HTML email templates with responsive design in `src/lib/email-templates/`
5. **Gmail Requirements**: 2FA must be enabled and App Password generated for authentication
6. **Verification**: Automatic SMTP connection verification on startup

### Internationalization (i18n)

The portfolio supports multiple languages:

1. **Default Language**: English (en)
2. **Supported Languages**: Spanish (es), Turkish (tr)
3. **Language Switching**: Automatic browser detection with manual override
4. **Adding Languages**: Add new translation files in `src/lib/i18n/translations/`
5. **Translation Management**: Use the translation proxy system for type-safe translations

## 🚀 Deployment

### Vercel (Current Production Deployment)

This portfolio is currently deployed on Vercel and accessible at:

- **Primary Domain**: [www.alptalha.dev](https://www.alptalha.dev)
- **Redirect Domain**: [alptalha.dev](https://alptalha.dev) (redirects to www.alptalha.dev)

#### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables (see Environment Variables section below)
4. Deploy automatically on push to main branch

The `vercel.json` configuration file includes:

- API CORS headers for contact form
- Next.js framework detection
- Automatic deployments

#### Environment Variables

For the contact form to work, configure these environment variables in Vercel:

```
GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-gmail-app-password
EMAIL_TO=your-gmail-address@gmail.com (optional, defaults to GMAIL_USER)
```

**Gmail Setup:**

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password for the application
3. Use the App Password (not your regular Gmail password) for `GMAIL_APP_PASSWORD`
4. The system automatically uses Gmail's SMTP settings (smtp.gmail.com:587)
5. Set `EMAIL_TO` to specify where contact emails should be sent (optional)

### Other Platforms

1. Build the project:

```bash
pnpm build
```

2. Deploy the output or run the production server
3. Ensure environment variables are configured for the contact form

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

- **Build Tool**: Turbopack for faster development and builds
- **Image Optimization**: Next.js automatic image optimization with WebP/AVIF support
- **Code Splitting**: Automatic with Next.js App Router and lazy loading components
- **Font Optimization**: Using Next.js font optimization for better loading performance
- **Bundle Analysis**: Optimized imports for Lucide React and Framer Motion
- **Security Headers**: Comprehensive security middleware with XSS protection and CSRF tokens
- **Caching**: Efficient caching strategies for static assets and API responses
- **Internationalization**: Efficient language switching without page reloads

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

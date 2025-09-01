# Google Analytics Integration

This document describes the Google Analytics 4 (GA4) integration implemented in this Next.js portfolio website.

## Implementation Details

### Files Added/Modified:

1. **`src/components/analytics/GoogleAnalytics.tsx`** - Main Google Analytics component
2. **`src/components/analytics/index.ts`** - Export file for analytics components
3. **`src/components/index.ts`** - Updated to include analytics exports
4. **`src/app/layout.tsx`** - Integrated Google Analytics component
5. **`.env.local`** - Added GA measurement ID
6. **`.env.example`** - Template for environment variables

### Environment Variables

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-7HHPX0QPME
```

The Google Analytics Measurement ID is configured as a public environment variable because:

- It's required on the client-side
- It's not sensitive information (visible in the browser anyway)
- Following Next.js best practices for client-side configuration

### Features

1. **Production-Only Loading**: Analytics only loads in production environment
2. **Modern Privacy Settings**: Uses current GA4 privacy controls (`allow_google_signals: false`, `allow_ad_personalization_signals: false`)
3. **TypeScript Support**: Properly typed with custom window interface extensions
4. **Custom Hooks**: `useGoogleAnalytics` hook for tracking custom events with flexible measurement ID support
5. **Next.js Optimized**: Uses Next.js `Script` component with `afterInteractive` strategy

### Usage

#### Basic Setup

The Google Analytics component is automatically included in the layout and will track page views.

#### Custom Event Tracking

```tsx
import { useGoogleAnalytics } from "@/components/analytics";

function MyComponent() {
  const { trackEvent } = useGoogleAnalytics();

  const handleButtonClick = () => {
    trackEvent("button_click", "engagement", "header_cta");
  };

  return <button onClick={handleButtonClick}>Click me</button>;
}
```

#### Page View Tracking

```tsx
import { useGoogleAnalytics } from "@/components/analytics";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

function MyApp() {
  // Option 1: Use default measurement ID from environment
  const { trackPageView } = useGoogleAnalytics();

  // Option 2: Use specific measurement ID
  // const { trackPageView } = useGoogleAnalytics("G-XXXXXXXXXX");

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Track page view for App Router
    trackPageView(pathname);
  }, [pathname, trackPageView]);
}
```

### Security Considerations

- The GA Measurement ID is not considered sensitive data
- Analytics only loads in production to avoid development noise
- Modern GA4 privacy settings are enabled:
  - `allow_google_signals: false` - Disables Google Signals for enhanced privacy
  - `allow_ad_personalization_signals: false` - Disables ad personalization signals
- Compatible with GDPR and other privacy regulations

### Testing

To test the implementation:

1. Build the project: `npm run build`
2. Start production server: `npm start`
3. Check browser developer tools Network tab for GA requests
4. Verify in Google Analytics real-time reports

### Next Steps

Consider implementing:

- Cookie consent management
- Enhanced e-commerce tracking
- Custom dimensions for user segmentation
- Privacy-compliant data collection based on user consent

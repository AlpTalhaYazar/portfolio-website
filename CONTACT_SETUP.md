# Gmail Contact Form Setup Guide

## Overview

This guide explains how to set up the contact form functionality using Gmail's SMTP service to send emails from your portfolio website.

## Prerequisites

- Gmail account
- Gmail App Password (not your regular Gmail password)

## Step 1: Generate Gmail App Password

1. **Enable 2-Factor Authentication** (if not already enabled):

   - Go to your Google Account settings
   - Navigate to "Security" → "2-Step Verification"
   - Follow the setup process

2. **Create App Password**:
   - Go to Google Account settings
   - Navigate to "Security" → "App passwords"
   - Select "Mail" as the app
   - Select "Other (Custom name)" as the device
   - Name it something like "Portfolio Website"
   - Copy the generated 16-character app password

## Step 2: Environment Configuration

Create a `.env.local` file in your project root with the following variables:

```env
# Gmail SMTP Configuration
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your_16_character_app_password

# Email Configuration
EMAIL_FROM=your_email@gmail.com
EMAIL_TO=your_email@gmail.com
```

**Important Notes:**

- Replace `your_email@gmail.com` with your actual Gmail address
- Replace `your_16_character_app_password` with the App Password from Step 1
- Use the App Password, NOT your regular Gmail password
- The `.env.local` file should never be committed to version control

## Step 3: Test the Setup

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Navigate to the contact section** of your website

3. **Fill out and submit the form** with test data

4. **Check your Gmail inbox** for the contact form submission

## Features

### Email Template

The contact form sends beautifully formatted HTML emails with:

- Professional styling
- Contact information table
- Formatted message content
- Timestamp
- Reply-to functionality (replies go directly to the contact person)

### Error Handling

- Form validation using Zod
- SMTP connection verification
- User-friendly error messages
- Server-side error logging

### Security Features

- Input sanitization
- Environment variable validation
- Secure SMTP connection (TLS)
- Rate limiting ready (can be added)

## Troubleshooting

### Common Issues

1. **"Email service not configured" error**:

   - Check that all environment variables are set correctly
   - Verify the `.env.local` file exists in the project root

2. **"Failed to connect to Gmail SMTP server" error**:

   - Verify your Gmail App Password is correct
   - Ensure 2-Factor Authentication is enabled on your Gmail account
   - Check that the App Password was created specifically for this application

3. **"Authentication failed" error**:

   - Double-check your Gmail address in `GMAIL_USER`
   - Verify you're using the App Password, not your regular password
   - Try generating a new App Password

4. **Emails not being received**:
   - Check your Gmail spam folder
   - Verify the `EMAIL_TO` environment variable
   - Test with a different recipient email address

### Testing Tips

- Start with your own email address as the recipient
- Test with different form inputs to ensure validation works
- Check browser console for any client-side errors
- Monitor server logs for detailed error information

## Production Deployment

When deploying to production:

1. **Set environment variables** in your hosting platform:

   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Heroku: Config Vars in dashboard

2. **Security considerations**:
   - Never commit `.env.local` or `.env` files
   - Use different App Passwords for different environments
   - Consider implementing rate limiting for production
   - Monitor email usage to stay within Gmail's limits

## Gmail Limits

Gmail SMTP has the following limits:

- **500 emails per day** for regular Gmail accounts
- **2000 emails per day** for Google Workspace accounts
- **100 recipients per message**

For higher volume needs, consider:

- Google Workspace upgrade
- Professional email service (SendGrid, Mailgun, etc.)
- Multiple Gmail accounts with load balancing

## API Endpoint

The contact form uses a Next.js API route at `/api/contact` with:

- **Method**: POST
- **Content-Type**: application/json
- **Body**: `{ name, email, subject, message }`
- **Response**: JSON with success/error status

## File Structure

```
src/
├── app/
│   └── api/
│       └── contact/
│           └── route.ts          # API endpoint for handling form submissions
└── components/
    └── pages/
        └── Contact.tsx           # Contact form component
```

## Support

If you encounter issues:

1. Check this guide first
2. Review server logs for detailed error messages
3. Test with a minimal example
4. Verify all environment variables are correctly set

---

**Security Note**: Keep your App Password secure and never share it publicly. If compromised, generate a new one immediately.

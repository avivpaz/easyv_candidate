// src/app/layout.js
import './globals.css';

export const metadata = {
  title: 'RightCruiter',
  description: 'Find and apply for jobs',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
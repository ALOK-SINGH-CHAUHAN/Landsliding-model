import type { Metadata } from 'next';
import './globals.css';
import { SimulatorProvider } from '@/context/SimulatorContext';

export const metadata: Metadata = {
  title: 'Landslide Sentinel — Early-Warning System Simulator',
  description:
    'Standalone browser-based geotechnical slope instability early-warning simulator with virtual sensors, digital logic circuits, and telemetry analysis.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-text-primary antialiased">
        <SimulatorProvider>{children}</SimulatorProvider>
      </body>
    </html>
  );
}

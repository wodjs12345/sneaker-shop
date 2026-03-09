// import type { Metadata } from 'next';
// import { Geist, Geist_Mono } from 'next/font/google';
// import './globals.css';
// import QueryProvider from '@/providers/QueryProvider';
// import Header from '@/components/layout/Header';

// const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
// const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'SOLE — 스니커즈 한정판 쇼핑몰',
//   description: '한정판 스니커즈를 만나보세요',
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="ko">
//       <body className={`${geistSans.variable} ${geistMono.variable} bg-primary text-white min-h-screen`}>
//         <QueryProvider>
//           <Header />
//           <main>{children}</main>
//         </QueryProvider>
//       </body>
//     </html>
//   );
// }
import type { Metadata } from 'next';
import './globals.css';
import QueryProvider from '@/providers/QueryProvider';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'SOLE — 스니커즈 한정판 쇼핑몰',
  description: '한정판 스니커즈를 만나보세요',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-primary text-white min-h-screen">
        <QueryProvider>
          <Header />
          <main>{children}</main>
        </QueryProvider>
      </body>
    </html>
  );
}
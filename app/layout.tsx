import './globals.css'
import Script from 'next/script'
import { IBM_Plex_Sans_Thai } from 'next/font/google'

const ibmPlexThai = IBM_Plex_Sans_Thai({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['thai', 'latin'],
  display: 'swap',
  variable: '--font-ibm-plex',
})

export const metadata = {
  title: 'SONGDOFREE | ค้นหาห้องซ้อมนครปฐม',
  description: 'รวมห้องซ้อมดนตรีคุณภาพในจังหวัดนครปฐม',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={ibmPlexThai.variable}>
      <head>
        <style>{`
          /* บังคับฟอนต์ทุก Element แบบเบ็ดเสร็จ */
          html, body, * {
            font-family: ${ibmPlexThai.style.fontFamily}, sans-serif !important;
          }

          /* ซ่อน Google Translate Toolbar */
          .goog-te-banner-frame.skiptranslate { display: none !important; }
          body { top: 0px !important; }
          .goog-te-gadget-icon, .goog-te-menu-value span { display: none !important; }

          /* ปรับระยะบรรทัดให้สระภาษาไทยไม่เบียด (แก้จุดที่คุณไม่ชอบ) */
          h1, h2, h3, h4, h5, h6 {
            line-height: 1.5 !important;
            letter-spacing: -0.01em !important;
          }
          
          p, span, button, input {
            line-height: 1.6 !important;
          }
        `}</style>
      </head>
      <body className="antialiased bg-slate-50 text-slate-900">
        {children}

        <div id="google_translate_element" style={{ visibility: 'hidden', position: 'absolute', zIndex: -1 }}></div>

        <Script id="google-translate-config" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              if (window.google && window.google.translate) {
                new google.translate.TranslateElement({
                  pageLanguage: 'th',
                  includedLanguages: 'th,en,zh-CN',
                  layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
                  autoDisplay: false,
                }, 'google_translate_element');
              }
            }
          `}
        </Script>

        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
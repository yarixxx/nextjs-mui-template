import type {Metadata} from "next";
import "./globals.css";
import {Geist} from "next/font/google";
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../../theme';

export const metadata: Metadata = {
    title: "My NextJS app",
    description: "Description of my next js application",
};

const geistSans = Geist({
    variable: "--font-app",
    subsets: ["latin"],
    weight: ["300", "400", "500", "700"], // Explicitly pull weight levels MUI elements expect
});

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" className={geistSans.variable}>
        <body>
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}
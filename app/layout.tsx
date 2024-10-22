import './globals.css'
import { Inter, Poppins, Roboto_Mono } from 'next/font/google'
import c from 'clsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const poppins = Poppins({
	weight: ['100', '300', '400', '500', '700'],
	subsets: ['latin'],
	variable: '--font-poppins',
});

const robotoMono = Roboto_Mono({
	weight: ['100', '200', '300', '400'],
	subsets: ['latin'],
	variable: '--font-roboto-mono',
});
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Grocery Purchase Tracker',
  description: 'It automates the process of recording your grocery expenses into a Google Sheet. Simplify your expense tracking by capturing receipt amounts and updating your Google Sheets effortlessly.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
        <body className={inter.className}>
            <main
                className={c(
                    'w-full flex min-h-screen justify-center items-center flex-col gap-2 md:gap-10',
                    poppins.variable,
                    robotoMono.variable,
                    'font-sans',
                )}
            >

			<ToastContainer
				position='bottom-center'
				autoClose={3000}
				limit={3}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='colored'
			/>
            {children}

			<div className='mx-auto my-4'>
			<p className='text-xs sm:text-sm font-bold flex justify-center items-center gap-2 flex-col sm:flex-row'>
				<span className='text-gray-400'>&copy; {new Date().getFullYear()} Copyright</span>
				<span className='hidden md:block'>{'-'}</span>
				<span className='text-gray-400 indent-0'>
					Created by
					<a
						href={process.env.NEXT_PUBLIC_PROFILE_LINK || 'https://github.com/paco0161'}
						target='_blank'
						rel='noopener noreferrer'
						className='ml-1 text-gray-600 hover:text-blue-500 hover:transition-colors'
					>
						paco0161
						<i className='fa-solid fa-arrow-up-right-from-square ml-1 text-xs'></i>
					</a>
				</span>
			</p>
		    </div>
        </main>
        </body>
    </html>
  )
}

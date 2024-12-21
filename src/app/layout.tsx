import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
	title: "Jonata.",
	description: "Meu portifolio pessoal",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-br">
			<body>
				{children}
				<footer>
					<p>2024</p>
					<p><small>Feito em</small></p>
					<ul>
						<li><img src="/img/next.webp" alt="NextJs" /></li>
						<li><img src="/img/sass.webp" alt="Sass" /></li>
					</ul>
				</footer>
			</body>
		</html>
	);
}

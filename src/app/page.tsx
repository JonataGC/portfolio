"use client"

import { useEffect, useRef, useState } from "react";
import "./page.css"
import { motion } from "motion/react";

export default function Home() {
	const data = [
		{
			name: "Introspecção",
			desc: "Este portifolio",
			link: "https://github.com/JonataGC/portifolio",
			lang: "Next Scss",
			img: "/img/porti.webp"
		},
		{
			name: "Projeto Pessoal",
			desc: "Meu site pessoal.",
			link: "https://jonatagc.com.br",
			lang: "Php MySql Scss",
			img: "/img/jgc.webp"
		},
		{
			name: "Xorc",
			desc: "Criptografia em xor para arquivos pequenos.",
			link: "https://github.com/JonataGC/Xorc",
			lang: "C++",
			img: "/img/xorc.webp"
		}
	]

	const canvasRef = useRef<HTMLCanvasElement | null>(null)
	const [main_title_text, setTitle] = useState('')
	let [windowWidth, setWindowWidth] = useState(0)
	let [windowHeigth, setWindowHeigth] = useState(0)

	useEffect(() => {
		setWindowHeigth(window?.innerHeight)
		setWindowWidth(window?.innerWidth)

		// Title animation
		let target_text = "JONATA"
		let newText: string[] = ".".repeat(target_text.length).split("")
		setTitle(newText.join(""))

		// Apocalipse 20:7
		async function impendingDoom() {
			setTimeout(() => {
				let index = Math.floor(Math.random() * target_text.length)
				newText[index] = target_text[index]
				let str = newText.join("")
	
				if (str != target_text) {
					setTitle(str)
					impendingDoom()
				} else {
					setTitle(target_text)
				}
			}, 70);
		}

		setTimeout(() => {
			impendingDoom()
		}, 150);

		// Banner head webgl setup
		const canvas = canvasRef.current;
		if (!canvas) return;

		const gl = canvas.getContext('webgl');
		if (!gl) {
			console.error('WebGL not supported');
			return;
		}

		// Banner glsl
		const vertexShaderSource = `
		attribute vec4 position;
		void main() {
			gl_Position = position;
		}
		`;
		const fragmentShaderSource = `
		precision highp float;
		uniform float iTime;
  		uniform vec2 iResolution;
		uniform vec2 iMouse;

		#define t iTime
		#define r iResolution.xy
		#define m iMouse

		void mainImage( out vec4 fragColor, in vec2 fragCoord ){
			vec3 c;
			float l, z = t;
			for(int i=0; i<3; i++) {
				vec2 uv, p = fragCoord.xy / r;
				uv = p;
				p -= 0.5;
				p.x *= r.x / r.y;
				p.x -= m.x / r.x - .5;
       			p.y += m.y / r.y - .5;
				l = length(p);
				z -= 0.07;
				uv += p / l * (cos(z) - 0.1) / abs(cos(l - 8. - z - z));
				c[i] = 0.01 / length(mod(uv, 1.) - 0.5);
			}
			fragColor = vec4(c / l, t);
		}

		void main() {
			mainImage(gl_FragColor, gl_FragCoord.xy);
		}
		`;

		// Opengl code 😴😴
		const createShader = (type: number, source: string) => {
			const shader = gl.createShader(type);
			if (!shader) throw new Error('Failed to create shader');
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				const error = gl.getShaderInfoLog(shader);
				gl.deleteShader(shader);
				throw new Error('Shader compile error: ' + error);
			}
			return shader;
		};
		const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
		const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
		const program = gl.createProgram();
		if (!program) throw new Error('Failed to create program');
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);

		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			const error = gl.getProgramInfoLog(program);
			gl.deleteProgram(program);
			throw new Error('Program link error: ' + error);
		}
		gl.useProgram(program);
		const positionAttributeLocation = gl.getAttribLocation(program, 'position');
		const positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(
		gl.ARRAY_BUFFER,
		new Float32Array([
			-1, -1,
			1, -1,
			-1, 1,
			-1, 1,
			1, -1,
			1, 1,
		]),
		gl.STATIC_DRAW
		);
		gl.enableVertexAttribArray(positionAttributeLocation);
		gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

		// Stuff to send to gpu
		const iResolutionLocation = gl.getUniformLocation(program, 'iResolution');
		const iTimeLocation = gl.getUniformLocation(program, 'iTime');
		const iMouse = gl.getUniformLocation(program, 'iMouse');
		let mxy: Array<number> = [window?.innerWidth/2,window?.innerHeight/2]
		const updateMousePosition = (ev: MouseEvent) => {
			mxy = [ev.clientX, ev.clientY];
		};
		window.addEventListener('mousemove', updateMousePosition);

		// Fps limiter
		let then = performance.now()
		const fps = 1000 / 60;

		const render = (time: number) => {
			requestAnimationFrame(render);
			const delta = time - then;

			if (delta >= fps - .1) {
				const width = window?.innerWidth;
				const height = window?.innerHeight;
				canvas.width = width;
				canvas.height = height;
				gl.viewport(0, 0, width, height);

				gl.uniform2f(iResolutionLocation, width, height);
				gl.uniform2f(iMouse, mxy[0], mxy[1]);
				gl.uniform1f(iTimeLocation, time * 0.0005);

				gl.clear(gl.COLOR_BUFFER_BIT);
				gl.drawArrays(gl.TRIANGLES, 0, 6);

				then = time - (delta % fps)
			}
		};
		requestAnimationFrame(render);

		// End of boring gl code 🎊🎊
		window.addEventListener("resize", () => {
			setWindowWidth(window.innerWidth)
			setWindowHeigth(window.innerHeight)
		})

		return () => {
			window.removeEventListener('mousemove', updateMousePosition);
		};

	}, []);
	

	return (
		<main>
			<section className="h-sobre">
				<div className="canvas-overlay"></div>
				<motion.canvas ref={canvasRef} className="gameCanvas" width={windowWidth} height={windowHeigth} initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: "5", delay: 0.1}}}></motion.canvas>
				<motion.h1 initial={{opacity: 0}} animate={{opacity: 1, transition: {duration: "0.35"}}} className="h-name-title">{main_title_text ||  "........"}</motion.h1>
				
				<motion.p initial={{opacity: 0}} animate={{opacity: 1, transition: {delay: .4, duration: "0.7"}}}>Desenvolvedor e designer, guiado pela exploração e criação, sempre descobrindo e testando o não convencional.</motion.p>
				<motion.a initial={{opacity: 0}} animate={{opacity: 1, transition: {delay: .6, duration: "0.7"}}} className="btn mt-m contato-btn" href="mailto:jgc@jonatagc.com.br">Entrar em contato</motion.a>
			</section>

			<section className="h-trabalhos">
				<h2 className="txc">Trabalhos</h2>
				<p className="txc mb-l">Meus projetos em programação.</p>

				<div className="card-ct">
				{data.map((c) => (
					<div key={"card_"+ c.name}>
						<div className="card" style={{backgroundImage: `url(${c.img})`}}>
							<div className="overlay"></div>
							<h3>{c.name}</h3>
							<p><small>{c.lang}</small></p>
							<div className="border">
								<p>{c.desc}</p>
								<a target="_blank" href={c.link}>Ir para site</a>
							</div>
						</div>
					</div>
				))}
				</div>
			</section>
		</main>
	);
}


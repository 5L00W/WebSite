// Seleciona o elemento canvas e o contexto 2D para desenhar nele
const canvas = document.getElementById('interactive-background');
const ctx = canvas.getContext('2d');

// Array para armazenar as partículas
let particles = [];

// Objeto para armazenar a posição do mouse
const mouse = {
    x: null,
    y: null,
    radius: 150
};

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

window.addEventListener('mousemove', (event) => {
    mouse.x = event.x;
    mouse.y = event.y;
    const cursor = document.getElementById('custom-cursor');
    cursor.style.left = mouse.x + 'px';
    cursor.style.top = mouse.y + 'px';
});

window.addEventListener('mousedown', (event) => {
    const cursor = document.getElementById('custom-cursor');
    cursor.classList.add('clicked');
    createParticles(event.x, event.y);
});

window.addEventListener('mouseup', () => {
    const cursor = document.getElementById('custom-cursor');
    cursor.classList.remove('clicked');
});

// Detectar elementos clicáveis
const clickableElements = document.querySelectorAll('a, button, .social-icon');

clickableElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        document.getElementById('custom-cursor').classList.add('active');
    });
    element.addEventListener('mouseleave', () => {
        document.getElementById('custom-cursor').classList.remove('active');
    });
});

//Fixed Text

document.addEventListener('DOMContentLoaded', () => {
    const fixedTextContainer = document.getElementById('fixed-text-container');
    const greetingElement = document.createElement('p');
    greetingElement.innerHTML = ' Hi, <span id="wave-emoji">👋🏻</span> </br>I\'m Pedro Gomes';
    fixedTextContainer.appendChild(greetingElement);
});

// Classe que representa uma partícula
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX * 0.3; // Reduz a velocidade das partículas
        this.directionY = directionY * 0.3; // Reduz a velocidade das partículas
        this.size = size;
        this.color = color;
    }

    // Desenha a partícula no canvas
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    // Atualiza a posição da partícula
    update() {
        // Inverte a direção se a partícula atingir as bordas do canvas
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }

        // Move a partícula
        this.x += this.directionX;
        this.y += this.directionY;

        // Desenha a partícula
        this.draw();
    }
}

// Inicializa as partículas
function init() {
    particles = [];
    let numberOfParticles = (canvas.width * canvas.height) / 9000; // Define o número de partículas com base na área do canvas
    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 1) + 1; // Define o tamanho das partículas
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2); // Define a posição x
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2); // Define a posição y
        let directionX = (Math.random() * 2) - 1; // Define a direção x
        let directionY = (Math.random() * 2) - 1; // Define a direção y
        let color = '#fff'; // Define a cor

        // Adiciona a nova partícula ao array
        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Conecta as partículas com linhas se estiverem próximas o suficiente
function connect() {
    let opacityValue = 1;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = ((particles[a].x - particles[b].x) * (particles[a].x - particles[b].x))
                + ((particles[a].y - particles[b].y) * (particles[a].y - particles[b].y));
            if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                opacityValue = 1 - (distance / 20000);
                ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
        // Conectar o mouse às partículas
        let mouseDistance = ((particles[a].x - mouse.x) * (particles[a].x - mouse.x))
            + ((particles[a].y - mouse.y) * (particles[a].y - mouse.y));
        if (mouseDistance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - (mouseDistance / 20000);
            ctx.strokeStyle = 'rgba(255,255,255,' + opacityValue + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
        }
    }
}

// Função para criar novas partículas no ponto clicado
function createParticles(x, y) {
    for (let i = 0; i < 3; i++) {
        let size = (Math.random() * 1) + 1;
        let directionX = (Math.random() * 2) - 1;
        let directionY = (Math.random() * 2) - 1;
        let color = '#fff';
        particles.push(new Particle(x, y, directionX, directionY, size, color));
    }

    // Remove 3 partículas aleatórias
    for (let i = 0; i < 3; i++) {
        if (particles.length > 0) {
            let index = Math.floor(Math.random() * particles.length);
            particles.splice(index, 1);
        }
    }
}

// Anima as partículas e as conexões
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }
    connect();
}

// Inicializa as partículas e inicia a animação
init();
animate();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Efeito de digitação
const texts = ["SOFTWARE DEVELOPER", "INDUSTRY 4.0", "LABEL DESIGNER"]; // Frases a serem digitadas
let textIndex = 0; // Índice da frase atual
let charIndex = 0; // Índice do caractere atual
let currentText = ''; // Texto atualmente sendo exibido
let isDeleting = false; // Indica se está deletando o texto
const typewriterText = document.getElementById('typewriter-text'); // Seleciona o elemento onde o texto será exibido

function type() {
    if (textIndex < texts.length) {
        if (!isDeleting && charIndex <= texts[textIndex].length) {
            // Se não estiver deletando e ainda houver caracteres na frase atual
            currentText = texts[textIndex].substring(0, charIndex);
            charIndex++;
            typewriterText.textContent = currentText;
        } else if (isDeleting && charIndex > 0) {
            // Se estiver deletando e ainda houver caracteres a serem removidos
            currentText = texts[textIndex].substring(0, charIndex);
            charIndex--;
            typewriterText.textContent = currentText;
        }

        if (!isDeleting && charIndex === texts[textIndex].length) {
            // Pausa de 3 segundos após digitar a frase inteira
            setTimeout(() => isDeleting = true, 3000);
        } else if (isDeleting && charIndex === 0) {
            // Passa para a próxima frase após deletar a atual
            isDeleting = false;
            textIndex++;
            if (textIndex === texts.length) {
                textIndex = 0; // Reinicia o ciclo após a última frase
            }
        }

        // Define a velocidade de digitação e deletação
        setTimeout(type, isDeleting ? 100 : 200);
    }
}

// Inicia o efeito de digitação
type();

document.querySelectorAll('#navbar a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Evita o comportamento padrão do link

        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        } else {
            window.location.href = this.getAttribute('href'); // Redireciona para a nova URL
        }
    });
});


//Contacto Manage Form:

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('#contact-form-element');

    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Impede o comportamento padrão de envio

        // Enviar o formulário via fetch para o backend
        fetch('/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: form.querySelector('#name').value,
                email: form.querySelector('#email').value,
                subject: form.querySelector('#subject').value,
                message: form.querySelector('#message').value
            })
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Mensagem de sucesso ou erro
            form.reset(); // Limpar o formulário
        })
        .catch(error => {
            alert('An error occurred. Please try again.');
            console.error('Error:', error);
        });
    });
});

// Aguarda o carregamento do DOM antes de iniciar o script
document.addEventListener('DOMContentLoaded', function () {
    // Obtém referências para elementos do DOM
    const scoreElement = document.getElementById('score');
    const gameContainer = document.getElementById('game-container');
    const controls = document.getElementById('controls');

    // Inicializa variáveis do jogo
    let snake = [[10, 10], [10, 9], [10, 8]];
    let food = generateFood();
    let direction = 'right';
    let score = 0;
    let lastButtonClickTime = 0;

    // Função para gerar a posição de comida evitando colisão com a cobra
    function generateFood() {
        const gridSize = window.innerWidth >= 480 ? 20 : 15;
        let newFood;

        do {
            newFood = [
                Math.floor(Math.random() * gridSize),
                Math.floor(Math.random() * gridSize)
            ];
        } while (snake.some(segment => segment[0] === newFood[0] && segment[1] === newFood[1]));

        return newFood;
    }

    // Função principal para atualizar o estado do jogo
    function updateGame() {
        // Lógica para mover a cobra
        // Verifica colisões com a parede ou com o próprio corpo
        // Atualiza a pontuação e gera nova comida quando a cobra come
        const head = [...snake[0]];
        switch (direction) {
            case 'up':
                head[0] -= 1;
                break;
            case 'down':
                head[0] += 1;
                break;
            case 'left':
                head[1] -= 1;
                break;
            case 'right':
                head[1] += 1;
                break;
        }

        const gridSize = window.innerWidth >= 480 ? 20 : 15;

        if (
            head[0] < 0 || head[0] >= gridSize ||
            head[1] < 0 || head[1] >= gridSize ||
            snake.some(segment => segment[0] === head[0] && segment[1] === head[1])
        ) {
            showGameOver();
            resetGame();
            return;
        }

        snake.unshift(head);

        if (head[0] === food[0] && head[1] === food[1]) {
            score += 1;
            food = generateFood();
        } else {
            snake.pop();
        }

        scoreElement.textContent = `Score: ${score}`;
        // Função para renderizar o estado atual do jogo no DOM
        renderGame();
    }

    function renderGame() {
        // Limpa o conteúdo do contêiner do jogo
        // Renderiza a cobra e a comida com base nas posições
        gameContainer.innerHTML = '';

        snake.forEach(segment => {
            const segmentDiv = document.createElement('div');
            segmentDiv.className = 'snake-segment';
            segmentDiv.style.gridRowStart = segment[0] + 1;
            segmentDiv.style.gridColumnStart = segment[1] + 1;
            gameContainer.appendChild(segmentDiv);
        });

        const foodDiv = document.createElement('div');
        foodDiv.className = 'food';
        foodDiv.style.gridRowStart = food[0] + 1;
        foodDiv.style.gridColumnStart = food[1] + 1;
        gameContainer.appendChild(foodDiv);
    }

    // Função para reiniciar o jogo
    function resetGame() {
        // Reinicia variáveis do jogo e renderiza a tela inicial
        snake = [[10, 10], [10, 9], [10, 8]];
        food = generateFood();
        direction = 'right';
        score = 0;
        scoreElement.textContent = 'Score: 0';
        renderGame();
    }

    function changeDirection(newDirection) {
        const currentTime = new Date().getTime();
        const elapsedTimeSinceLastClick = currentTime - lastButtonClickTime;

        // Define um intervalo mínimo entre cliques (por exemplo, 300 milissegundos)
        if (elapsedTimeSinceLastClick >= 300) {
            // Verifica se a nova direção é válida (não é a direção oposta)
            if (
                (newDirection === 'up' && direction !== 'down') ||
                (newDirection === 'down' && direction !== 'up') ||
                (newDirection === 'left' && direction !== 'right') ||
                (newDirection === 'right' && direction !== 'left')
            ) {
                // Função para mudar a direção da cobra
                direction = newDirection;
                lastButtonClickTime = currentTime;
            }
        }
    }

    function showGameOver() {
        // Função para exibir um alerta de Game Over
        alert(`Game Over! Total de pontos: ${score}`);
    }

    // Adiciona eventos de clique nas imagens das setas (controles)
    document.addEventListener('click', function (event) {
        if (event.target.tagName === 'IMG') {
            changeDirection(event.target.id);
        }
    });

    // Adiciona eventos de teclado para controle direcional
    document.addEventListener('keydown', function (event) {
        switch (event.key) {
            case 'ArrowUp':
                changeDirection('up');
                break;
            case 'ArrowDown':
                changeDirection('down');
                break;
            case 'ArrowLeft':
                changeDirection('left');
                break;
            case 'ArrowRight':
                changeDirection('right');
                break;
        }
    });

    // Define a função de atualização do jogo para ser chamada a cada 220 milissegundos
    setInterval(updateGame, 220);
});

// Define o tamanho das células do jogo com base no tamanho da janela
const cellSize = window.innerWidth < 480 ? window.innerWidth / 15 : 20;
gameContainer.style.gridTemplateColumns = `repeat(15, ${cellSize}px)`;
gameContainer.style.gridTemplateRows = `repeat(15, ${cellSize}px)`;

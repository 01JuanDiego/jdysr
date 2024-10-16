let move_speed = 3, grativy = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');

//Ajustar tamaño pájaro
bird.style.width = '75px';
bird.style.height = '65px';

//Agregar música de fondo
let background_music = new Audio('musicaFondo/enamoradotuyo.mp3');
background_music.loop = true; // Para que la música se repita
background_music.volume = 1; // Ajusta el volumen si es necesario


// getting bird element properties
let bird_props = bird.getBoundingClientRect();

// This method returns DOMReact -> top, right, bottom, left, x, y, width and height
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');

// Crear elemento para mostrar la pantalla de victoria (Nuevo)
// Crear elemento para mostrar la pantalla de victoria (Nuevo)
let win_screen = document.createElement('div');
win_screen.className = 'win_screen';
win_screen.style.display = 'none'; // Ocultarlo inicialmente
win_screen.style.position = 'fixed'; // Para que ocupe toda la pantalla
win_screen.style.top = '0';
win_screen.style.left = '0';
win_screen.style.width = '100vw';
win_screen.style.height = '100vh';
win_screen.style.zIndex = '9999'; // Asegura que esté por encima de todo lo demás
document.body.appendChild(win_screen);

let game_state = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    
    if(e.key == 'Enter' && game_state != 'Play'){
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
        bird.style.top = '40vh';
        game_state = 'Play';
        message.innerHTML = '';
        score_title.innerHTML = 'Puntos : ';
        score_val.innerHTML = '0';
        message.classList.remove('messageStyle');

        //Reproducir música de fondo cuando el juego comienza
        background_music.play();

        //Ocultar la pantalla de victoria en caso de reinicio
        win_screen.style.display = 'none';

        play();
    }
});

function play(){
    function move(){
        if(game_state != 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if(pipe_sprite_props.right <= 0){
                element.remove();
            }else{
                if(bird_props.left < pipe_sprite_props.left + pipe_sprite_props.width && bird_props.left + bird_props.width > pipe_sprite_props.left && bird_props.top < pipe_sprite_props.top + pipe_sprite_props.height && bird_props.top + bird_props.height > pipe_sprite_props.top){
                    game_state = 'End';
                    message.innerHTML = 'Perdiste 😶'.fontcolor('red') + '<br>Presiona enter, sigue intentando bb!';
                    message.classList.add('messageStyle');
                    img.style.display = 'none';
                    sound_die.play();

                    //Detener la música de fondo cuando el juego termina
                    background_music.pause();
                    background_music.currentTime = 0;

                    return;
                }else{
                    if(pipe_sprite_props.right < bird_props.left && pipe_sprite_props.right + move_speed >= bird_props.left && element.increase_score == '1'){
                        score_val.innerHTML =+ score_val.innerHTML + 1;
                        sound_point.play();

                        //Verificar si el puntaje alcanza 38 para ganar 
                        if(+score_val.innerHTML === 15) {
                            game_state = 'Win';
                            displayWinScreen();
                        }
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity(){
        if(game_state != 'Play') return;
        bird_dy = bird_dy + grativy;
        document.addEventListener('keydown', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird-2.png';
                bird_dy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if(e.key == 'ArrowUp' || e.key == ' '){
                img.src = 'images/Bird.png';
            }
        });

        if(bird_props.top <= 0 || bird_props.bottom >= background.bottom){
            game_state = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');

            //Detener la música de fondo cuando el juego termina
            background_music.pause();
            background_music.currentTime = 0;

            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_seperation = 0;

    let pipe_gap = 35;

    function create_pipe(){
        if(game_state != 'Play') return;

        if(pipe_seperation > 115){
            pipe_seperation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_seperation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}


// Función para mostrar la pantalla de victoria (Actualizada)
function displayWinScreen() {
    // Ocultar todos los elementos del juego, pero dejar visible el fondo de victoria
    bird.style.display = 'none';
    img.style.display = 'none';
    score_val.style.display = 'none';
    message.style.display = 'none';
    score_title.style.display = 'none';
    document.querySelectorAll('.pipe_sprite').forEach((e) => e.style.display = 'none');

    // Mostrar la pantalla de victoria como una capa sobre el fondo de victoria
    win_screen.style.display = 'flex';
    win_screen.style.justifyContent = 'center';
    win_screen.style.alignItems = 'center';
    win_screen.style.flexDirection = 'column';
    win_screen.style.position = 'fixed';
    win_screen.style.top = '0';
    win_screen.style.left = '0';
    win_screen.style.width = '100vw';
    win_screen.style.height = '100vh';
    win_screen.style.zIndex = '9999'; // Asegura que esté encima de todo lo demás
    win_screen.style.backgroundImage = 'url("images/fondo.gif")'; // Reemplaza con la ruta de tu fondo de victoria
    win_screen.style.backgroundSize = 'cover'; // Asegura que el fondo cubra toda la pantalla
    win_screen.style.backgroundPosition = 'center'; // Centra la imagen de fondo

    // Añadir el texto que desees (Modificación)
    let win_text = document.createElement('h1');
    win_text.innerHTML = '¡Felicidades 🎉🥳, has ganado... mi ❤️!'; // Reemplaza este texto por el que desees
    win_text.style.color = 'green'; // Color del texto, ajústalo si lo deseas
    win_text.style.fontSize = '3rem'; // Tamaño de la fuente
    win_text.style.textAlign = 'center'; // Centrar el texto
    win_text.style.backgroundColor = 'rgba(255, 255, 255, 0.5)'; // Fondo semitransparente para el texto si es necesario
    win_text.style.padding = '10px'; // Espacio alrededor del texto
    win_screen.appendChild(win_text);

    // Añadir la imagen que desees (Modificación)
    let win_image = document.createElement('img');
    win_image.src = 'images/mes.jpg'; // Reemplaza con la ruta de tu imagen
    win_image.alt = 'You Win!';
    win_image.style.width = '13%'; // Ajusta el tamaño de la imagen si es necesario
    win_image.style.marginTop = '20px'; // Espacio entre el texto y la imagen
    win_image.style.cursor = 'pointer'; 
    win_screen.appendChild(win_image);

    // Añadir el texto "presiona la imagen" (Modificación)
    let click_prompt = document.createElement('p');
    click_prompt.innerHTML = ' Te esforzaste mucho, ahora presiona nuestra fotito amorcito';
    click_prompt.style.color = 'black';
    click_prompt.style.fontSize = '1.5rem';
    click_prompt.style.textAlign = 'center';
    click_prompt.style.marginTop = '10px'; // Espacio entre la imagen y el texto
    win_screen.appendChild(click_prompt);

    // Evento para cuando se presiona la imagen (Modificación)
    win_image.addEventListener('click', () => {
        // Mostrar el texto que deseas al presionar la imagen
        let new_text = document.createElement('h2');
        new_text.innerHTML = '¡¡Feliz primer mes de casados 🙌🥰!!, eres la mujer de mi vida TE AMO mucho 💕'; // Reemplaza con tu texto
        new_text.style.color = 'blue';
        new_text.style.fontSize = '3rem';
        new_text.style.fontFamily = 'Roboto';
        new_text.style.textAlign = 'center';
        new_text.style.marginTop = '20px';
        win_screen.innerHTML = ''; // Limpiar el contenido anterior de win_screen
        win_screen.appendChild(new_text);
    });

    // La música de fondo no se pausa, continúa sonando en bucle
}


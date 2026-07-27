/* ====================================================================
   Reproductor de proyectos del portafolio
   - Muestra un proyecto a la vez; la tira de miniaturas cambia de proyecto.
   - Pausa (y reinicia) el video anterior para que no siga sonando.
   ==================================================================== */
(function () {
    'use strict';

    var seccion = document.querySelector('.seccion-portafolio');
    if (!seccion) {
        return;
    }

    var proyectos = seccion.querySelectorAll('.galeria');
    if (!proyectos.length) {
        return;
    }

    // Avisa al CSS de que JavaScript está activo: a partir de aquí el proyecto
    // visible lo decide la clase .galeria--activa y no el :target de la URL.
    // (history.replaceState no actualiza :target, y eso impedía cambiar de video.)
    seccion.classList.add('js-portafolio');

    function idDesdeHash() {
        return (window.location.hash || '').replace('#', '');
    }

    function mostrarProyecto(id) {
        var encontrado = false;

        Array.prototype.forEach.call(proyectos, function (proyecto) {
            var activo = proyecto.id === id;
            if (activo) {
                encontrado = true;
            }

            proyecto.classList.toggle('galeria--activa', activo);

            // Detener el video de los proyectos que no están visibles
            if (!activo) {
                var video = proyecto.querySelector('video');
                if (video) {
                    if (!video.paused) {
                        video.pause();
                    }
                    if (video.currentTime !== 0) {
                        video.currentTime = 0;
                    }
                }
            }
        });

        // Si el hash no corresponde a ningún proyecto, dejar visible el primero
        if (!encontrado) {
            proyectos[0].classList.add('galeria--activa');
        }
    }

    function sincronizar() {
        var id = idDesdeHash();
        mostrarProyecto(id || proyectos[0].id);
    }

    // Cambiar de proyecto sin saltar el scroll ni ensuciar el historial
    Array.prototype.forEach.call(seccion.querySelectorAll('.filmstrip-item'), function (enlace) {
        enlace.addEventListener('click', function (evento) {
            var destino = (enlace.getAttribute('href') || '').replace('#', '');
            if (!destino || !document.getElementById(destino)) {
                return;
            }
            evento.preventDefault();

            if (window.history && window.history.replaceState) {
                window.history.replaceState(null, '', '#' + destino);
            } else {
                window.location.hash = destino;
            }
            mostrarProyecto(destino);
        });
    });

    window.addEventListener('hashchange', sincronizar);
    sincronizar();
})();

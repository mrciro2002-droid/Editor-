/* ====================================================================
   Control de reproducción de la galería
   - Pausa (y reinicia) cualquier video que no sea el que está abierto,
     para que no siga sonando al cambiar de proyecto.
   - Permite cerrar la galería con la tecla Escape.
   ==================================================================== */
(function () {
    'use strict';

    var videos = document.querySelectorAll('.galeria video');
    if (!videos.length) {
        return;
    }

    function idActivo() {
        return (window.location.hash || '').replace('#', '');
    }

    function pausarLosDemas() {
        var activo = idActivo();

        Array.prototype.forEach.call(videos, function (video) {
            var galeria = video.parentNode;
            while (galeria && !(galeria.classList && galeria.classList.contains('galeria'))) {
                galeria = galeria.parentNode;
            }
            if (!galeria) {
                return;
            }

            // Si esta galería no es la que está abierta, detener su video
            if (galeria.id !== activo) {
                if (!video.paused) {
                    video.pause();
                }
                if (video.currentTime !== 0) {
                    video.currentTime = 0;
                }
            }
        });
    }

    window.addEventListener('hashchange', pausarLosDemas);
    pausarLosDemas();

    // Cerrar la galería abierta con Escape
    document.addEventListener('keydown', function (evento) {
        if (evento.key !== 'Escape') {
            return;
        }
        var abierta = document.querySelector('.galeria:target');
        if (abierta) {
            window.location.hash = 'portafolio';
        }
    });
})();

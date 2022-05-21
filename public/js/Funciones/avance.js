import Swal from "sweetalert2";

export const actualizarAvance = () => {
    //seleccionar las tareas existentes
    const tareas = document.querySelectorAll('li.tarea');

    if (tareas) {
        //seleccionar las tareas completadas
        const tareasCompletadas = document.querySelectorAll('i.completo');


        //calcular el avnace 

        const Avance = Math.round((tareasCompletadas.length / tareas.length) * 100);

        ///mostrar el avance
        const porcentaje = document.querySelector('#porcentaje');

        if (porcentaje) {
            porcentaje.style.width = Avance + '%';
        }

        if (Avance === 100) {
            Swal.fire(
                'Proyecto Completado!',
                'Felicidades, Has Terminado Tus Tareas ',
                'success'

            )
        }



    }
}
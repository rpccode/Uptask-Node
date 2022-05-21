import axios from "axios";
import Swal from "sweetalert2";
const tareas = document.querySelector('.listado-pendientes');

import { actualizarAvance } from "../Funciones/avance";


if (tareas) {
    tareas.addEventListener('click', (e) => {
        if (e.target.classList.contains('fa-check-circle')) {
            const icono = e.target;
            const idTarea = icono.parentElement.parentElement.dataset.tarea;

            //request hacia /tareas/id
            const url = `${location.origin}/tareas/${idTarea}`;

            axios.patch(url, { idTarea })
                .then(response => {
                    if (response.status === 200) {
                        icono.classList.toggle('completo');;
                        actualizarAvance();
                    }
                })
                .catch(err => console.error(err))

        }

        if (e.target.classList.contains('fa-trash')) {
            const tareasHTML = e.target.parentElement.parentElement,
                idtarea = tareasHTML.dataset.tarea;

            Swal.fire({
                title: 'Deseas Elminar este Tarea?',
                text: "Un Tarea Eliminada No se puede Recuperar!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'SI, Borrar!',
                cancelButtonText: 'NO, Cancelar'
            }).then((result) => {

                if (result.isConfirmed) {
                    //request hacia /tareas/id
                    const url = `${location.origin}/tareas/${idtarea}`;
                    //enviar el ddelect con axios
                    axios.delete(url, { params: { idtarea } })
                        .then(response => {
                            if (response.status === 200) {
                                //Eliminar el nodo
                                Swal.fire(
                                    'Tarea Eliminada!',
                                    response.data,
                                    'success'
                                );
                                tareasHTML.parentElement.removeChild(tareasHTML);
                                actualizarAvance();

                            }


                        })
                }
            });
        }
    });
}
export default tareas;
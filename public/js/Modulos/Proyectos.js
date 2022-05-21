import Swal from "sweetalert2";
import axios from "axios";


const btnEliminar = document.querySelector("#eliminar-proyecto");

if (btnEliminar) {
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl;

        // console.log(urlProyecto);


        Swal.fire({
            title: 'Deseas Elminar este Proyecto?',
            text: "Un Proyecto Eliminado No se puede Recuperar!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'SI, Borrar!',
            cancelButtonText: 'NO, Cancelar'
        }).then((result) => {

            if (result.isConfirmed) {

                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: { urlProyecto } })
                    .then((result) => {
                        console.log(result);


                        Swal.fire(
                            'Proyecto Eliminado!',
                            result.data,
                            'success'
                        );

                        //redireccionar al Inicio 
                        setTimeout(() => {
                            window.location.href = '/';
                        }, 3000);

                    }).catch((err) => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un Error',
                            text: 'No se pudo Eliminar el Proyecto',
                        })
                    });

            }
        })
    });



}
export default btnEliminar;
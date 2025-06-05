const agenda = [
    {nombre: "Maria", fecha: "14-06-2025", hora: "10:00"},
    {nombre: "Carlos", fecha: "20-06-2025", hora: "14:30"},
    {nombre: "Valentina", fecha: "25-06-2025", hora: "11:00"},
    {nombre: "Nancy", fecha: "17-06-2025", hora:"10:00"},
    {nombre: "Juan", fecha: "18-06-2025", hora: "11:30"}
];

function agendarTurno(nombre, fecha, hora) {
    const nuevoTurno = { nombre, fecha, hora};
    agenda.push(nuevoTurno);
    alert(`Turno agendado con exito para ${nombre} el dia ${fecha} a las ${hora}`);
}

function mostrarAgenda() {
    console.log("Turnos Agendados");
    for (const turno of agenda) {
        console.log(`${turno.nombre} - ${turno.fecha} a las ${turno.hora}`);
    }
}

function iniciar(){
    const opcion = prompt("Bienvenido/a. ¿Que queres hacer?\n1 - Ver Turnos\n2 - Sacar un Turno");
    
    if (opcion === "1") {
        mostrarAgenda();
    } else if (opcion ==="2"){
        const nombre = prompt ("Nombre del paciente:");
        const fecha = prompt ("Fecha del turno (DD-MM-YYYY:");
        const hora = prompt ("Hora del turno (HH:MM):");
        agendarTurno(nombre, fecha, hora);
        alert(" Turno agendado con exito.")
        mostrarAgenda();
    } else {
        alert ("Opcion no valida.")
    }
}

iniciar();

function mostrarAgenda() {
    let mensaje = "Turnos Agendados:\n";
    for (const turno of agenda) {
        mensaje += `${turno.nombre} - ${turno.fecha} a las ${turno.hora}\n`;
    }
    alert(mensaje);  
    console.log(mensaje);
}

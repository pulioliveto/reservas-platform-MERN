import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

export async function notifyReservaAdmin({ adminEmail, clienteNombre, clienteEmail, fecha, turno, empleadoNombre, negocioNombre }) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: adminEmail,
    subject: "TURNO RECIBIDO",
    html: `
      <h3>¡NUEVO TURNO!</h3>
        <p><b>¡Para ver el turno más detallado revisa en la WEB</b></p>

      <p><b>Negocio:</b> ${negocioNombre}</p>
      <p><b>Cliente:</b> ${clienteNombre}</p>
      <p><b>Email cliente:</b> ${clienteEmail}</p>
      <p><b>Fecha:</b> ${fecha}</p>
      <p><b>Hora:</b> ${turno}</p>
      <p><b>Profesional:</b> ${empleadoNombre || "No asignado"}</p>
    `,
  });
}

export async function notifyReservaCliente({ clienteEmail, negocioNombre, fecha, turno, empleadoNombre }) {
    console.log(" enviando mail clienteEmail:", clienteEmail);
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: clienteEmail,
    subject: `TURNO CONFIRMADO en ${negocioNombre}`,
    html: `
      <h3>¡TU TURNO FUE CONFIRMADO!</h3>
      <p><b>Negocio:</b> ${negocioNombre}</p>
      <p><b>Fecha:</b> ${fecha}</p>
      <p><b>Hora:</b> ${turno}</p>
      <p><b>Profesional:</b> ${empleadoNombre || "No asignado"}</p>
    `,
  });
}

export async function notifyCancelacionAdmin({ adminEmail, clienteNombre, fecha, turno, negocioNombre }) {
  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: adminEmail,
    subject: `TURNO CANCELADO por ${clienteNombre}`,
    html: `
      <h3>TURNO CANCELADO</h3>
      <p><b>Negocio:</b> ${negocioNombre}</p>
      <p><b>Cliente:</b> ${clienteNombre}</p>
      <p><b>Fecha:</b> ${fecha}</p>
      <p><b>Hora:</b> ${turno}</p>
    `,
  });
}
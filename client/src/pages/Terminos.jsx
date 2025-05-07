import React from "react";
import { Container } from "react-bootstrap";

const Terminos = () => (
  <Container className="py-5">
    <h1 className="mb-4">Términos de Servicio</h1>
    <p>
      Bienvenido a ReservaTurnos. Al utilizar nuestra plataforma, aceptas cumplir con los siguientes términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, por favor no utilices nuestro servicio.
    </p>
    <h4>1. Uso del Servicio</h4>
    <p>
      ReservaTurnos ofrece una plataforma para la gestión de reservas y turnos para negocios y clientes. El uso indebido, fraudulento o no autorizado del servicio está prohibido.
    </p>
    <h4>2. Cuentas de Usuario</h4>
    <p>
      Eres responsable de mantener la confidencialidad de tu cuenta y contraseña, así como de todas las actividades que ocurran bajo tu cuenta.
    </p>
    <h4>3. Privacidad</h4>
    <p>
      Nos comprometemos a proteger tu información personal. Consulta nuestra <a href="/privacidad">Política de Privacidad</a> para más detalles.
    </p>
    <h4>4. Modificaciones</h4>
    <p>
      Nos reservamos el derecho de modificar estos términos en cualquier momento. Las modificaciones serán notificadas a través de la plataforma.
    </p>
    <h4>5. Contacto</h4>
    <p>
      Si tienes preguntas sobre estos términos, contáctanos en <a href="mailto:reservaturnosapp@gmail.com">reservaturnosapp@gmail.com</a>.
    </p>
    <p className="mt-4 text-muted">Última actualización: {new Date().toLocaleDateString()}</p>
  </Container>
);

export default Terminos;
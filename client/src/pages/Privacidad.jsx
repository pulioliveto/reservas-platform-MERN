import React from "react";
import { Container } from "react-bootstrap";

const Privacidad = () => (
  <Container className="py-5">
    <h1 className="mb-4">Política de Privacidad</h1>
    <p>
      En ReservaTurnos, valoramos tu privacidad y nos comprometemos a proteger tus datos personales. Esta política describe cómo recopilamos, usamos y protegemos tu información.
    </p>
    <h4>1. Información que Recopilamos</h4>
    <p>
      Recopilamos información que nos proporcionas al registrarte, crear reservas o contactar con nosotros. Esto puede incluir tu nombre, correo electrónico, número de teléfono y datos de tu negocio.
    </p>
    <h4>2. Uso de la Información</h4>
    <p>
      Utilizamos tus datos para ofrecer y mejorar nuestros servicios, gestionar reservas y enviarte notificaciones relevantes.
    </p>
    <h4>3. Compartir Información</h4>
    <p>
      No compartimos tu información personal con terceros, salvo cuando sea necesario para prestar el servicio o por requerimiento legal.
    </p>
    <h4>4. Seguridad</h4>
    <p>
      Implementamos medidas de seguridad para proteger tus datos contra accesos no autorizados.
    </p>
    <h4>5. Tus Derechos</h4>
    <p>
      Puedes acceder, corregir o eliminar tu información personal contactándonos en <a href="mailto:reservaturnosapp@gmail.com">reservaturnosapp@gmail.com</a>.
    </p>
    <h4>6. Cambios en la Política</h4>
    <p>
      Nos reservamos el derecho de modificar esta política. Los cambios serán publicados en esta página.
    </p>
    <p className="mt-4 text-muted">Última actualización: {new Date().toLocaleDateString()}</p>
  </Container>
);

export default Privacidad;
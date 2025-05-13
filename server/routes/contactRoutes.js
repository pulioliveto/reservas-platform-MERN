import express from "express";
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const resend = new Resend(process.env.RESEND_API_KEY); // pon tu API Key en .env

router.post("/contact", async (req, res) => {
  const { name, email, subject, message } = req.body;

  try {
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "reservaturnosapp@gmail.com",
      subject: subject,
      html: `
        <p><b>Nombre:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mensaje:</b><br/>${message}</p>
      `,
    });
    res.status(200).json({ success: true, message: "Mensaje enviado correctamente" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error al enviar el mensaje" });
  }
});

export default router;
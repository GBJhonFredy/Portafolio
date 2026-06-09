declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
  serve(handler: (req: Request) => Promise<Response> | Response): void;
};

const RESEND_API_URL = "https://api.resend.com/emails";
const REPLY_PANEL_URL = "https://portafolio-xkbi.vercel.app/ReplyMessenger";

Deno.serve(async (req: Request): Promise<Response> => {
  try {
    const body = await req.json();

    const record = (body as any)?.record;
    if (!record) {
      console.error("Payload sin record:", body);
      return new Response(
        JSON.stringify({ error: "No record in payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const visitorName: string =
      record.visitor_name || "Visitante sin nombre";
    const visitorEmail: string = record.visitor_email || "sin email";
    const visitorMessage: string = record.visitor_message || "";
    const ownerReply: string = record.owner_reply || "";
    const isReply: boolean = record.is_reply === true;

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      console.error("RESEND_API_KEY no está configurada en el proyecto");
      return new Response(
        JSON.stringify({ error: "RESEND_API_KEY no configurada" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    let to: string[];
    let subject: string;
    let text: string;

    if (!isReply) {
      // CORREO PARA TI (ADMIN) - solo texto plano con URL
      to = ["jhongilb1993@gmail.com"];
      subject = "Nuevo mensaje desde el Messenger de tu portafolio";

      text = [
        "Tienes un nuevo mensaje:",
        "",
        `Nombre: ${visitorName}`,
        `Email del visitante: ${visitorEmail}`,
        "",
        "Mensaje:",
        visitorMessage,
        "",
        "Puedes responder desde el panel en esta URL:",
        REPLY_PANEL_URL,
      ].join("\n");
    } else {
      // CORREO PARA EL VISITANTE (TU RESPUESTA)
      if (!visitorEmail || visitorEmail === "sin email") {
        console.warn(
          "Mensaje de respuesta sin email de visitante, no se envía correo.",
        );
        return new Response(
          JSON.stringify({
            ok: true,
            message: "Reply sin email de visitante, no se envió correo",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      if (!ownerReply) {
        console.warn(
          "is_reply = true pero owner_reply vacío, no se envía correo.",
        );
        return new Response(
          JSON.stringify({
            ok: true,
            message: "Reply sin contenido, no se envió correo",
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }

      to = [visitorEmail];
      subject = "Respuesta a tu mensaje en el portafolio";

      text = [
        `Hola ${visitorName},`,
        "",
        "Gracias por escribir en el Messenger de mi portafolio.",
        "",
        "Tu mensaje original:",
        visitorMessage || "(sin mensaje)",
        "",
        "Mi respuesta:",
        ownerReply,
        "",
        "Si tienes más preguntas, solo responde a este correo o vuelve al portafolio:",
        "https://portafolio-xkbi.vercel.app",
      ].join("\n");
    }

    const resendResponse = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Portfolio Messenger <onboarding@resend.dev>",
        to,
        subject,
        text, // Solo texto, sin HTML
      }),
    });

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Error al enviar email con Resend:", errorText);
      return new Response(
        JSON.stringify({
          error: "Error enviando email",
          detail: errorText,
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    const resendData = await resendResponse.json();
    console.log("Email enviado correctamente:", resendData);

    return new Response(
      JSON.stringify({ ok: true, message: "Email enviado" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("Error en send-message-email function:", err);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
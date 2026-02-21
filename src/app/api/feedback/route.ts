import { Resend } from "resend";

const resend = new Resend("re_as84zv71_PpFHnMTcdH1yGM58XxosbT6F");
export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    await resend.emails.send({
      from: "Feedback <onboarding@resend.dev>",
      to: "chmercier072472@gmail.com",
      subject: "New Feedback Submission",
      html: `<p>${message}</p>`
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error(error);
    return new Response("Error sending email", { status: 500 });
  }
}
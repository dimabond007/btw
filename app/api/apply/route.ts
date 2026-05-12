export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const data = await request.json();

    const { name, email, phone, service, motivation, locale } = data ?? {};

    if (!name || !email || !phone || !service || !motivation) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    const application = await prisma.application.create({
      data: {
        name: String(name ?? ""),
        email: String(email ?? ""),
        phone: String(phone ?? ""),
        service: String(service ?? ""),
        motivation: String(motivation ?? ""),
        locale: String(locale ?? "en"),
      },
    });

    // Send email notification
    try {
      const appUrl = process.env.NEXTAUTH_URL || "";
      const appName = appUrl
        ? new URL(appUrl).hostname?.split(".")?.[0]
        : "BTW";

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a1a; color: #e0e0e0; padding: 30px;">
          <div style="border-bottom: 3px solid #c62828; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #fff; margin: 0;">New Application \u2014 BE THE WEAPON</h2>
          </div>
          <div style="background: #222; padding: 20px; border-radius: 4px; margin-bottom: 15px;">
            <p style="margin: 8px 0;"><strong style="color: #c62828;">Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong style="color: #c62828;">Email:</strong> <a href="mailto:${email}" style="color: #e0e0e0;">${email}</a></p>
            <p style="margin: 8px 0;"><strong style="color: #c62828;">Phone:</strong> ${phone}</p>
            <p style="margin: 8px 0;"><strong style="color: #c62828;">Service:</strong> ${service}</p>
            <p style="margin: 8px 0;"><strong style="color: #c62828;">Language:</strong> ${locale}</p>
          </div>
          <div style="background: #222; padding: 20px; border-radius: 4px;">
            <p style="margin: 0 0 8px 0;"><strong style="color: #c62828;">Motivation:</strong></p>
            <div style="background: #1a1a1a; padding: 15px; border-left: 3px solid #c62828; color: #ccc;">
              ${motivation}
            </div>
          </div>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">
            Submitted at: ${new Date().toLocaleString()}
          </p>
        </div>
      `;

      await fetch("https://apps.abacus.ai/api/sendNotificationEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deployment_token: process.env.ABACUSAI_API_KEY,
          app_id: process.env.WEB_APP_ID,
          notification_id: process.env.NOTIF_ID_APPLICATION_FORM_SUBMISSION,
          subject: `New BTW Application: ${name} - ${service}`,
          body: htmlBody,
          is_html: true,
          recipient_email: "dimistma@gmail.com",
          sender_email: appUrl
            ? `noreply@${new URL(appUrl).hostname}`
            : undefined,
          sender_alias: "BE THE WEAPON",
        }),
      });
    } catch (emailError: any) {
      console.error("Email notification error:", emailError);
    }

    return NextResponse.json({
      success: true,
      id: application?.id ?? "",
    });
  } catch (error: any) {
    console.error("Application error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to submit application" },
      { status: 500 },
    );
  }
}

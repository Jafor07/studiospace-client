import { formatDate, formatShortDate, formatTime } from "@/app/lib/utils";

// OPTIONAL FEATURE: PDF booking invoice.
// buildInvoice draws the page. downloadInvoice loads jsPDF only when the
// button is clicked, so it doesn't make the rest of the site heavier.
export function buildInvoice(JsPdf, booking) {
  const doc = new JsPdf({ unit: "pt", format: "a4" });
  const width = doc.internal.pageSize.getWidth();
  const invoiceNumber = `SS-${booking._id.slice(-8).toUpperCase()}`;
  const money = (amount) => `$${Number(amount).toFixed(2)}`;

  // Header band
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 0, width, 96, "F");
  doc.setTextColor(32, 24, 12);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(26);
  doc.text("StudioSpace", 40, 56);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text("Booking invoice", width - 40, 44, { align: "right" });
  doc.text(invoiceNumber, width - 40, 62, { align: "right" });

  // Two columns: billed to / studio
  doc.setTextColor(110, 110, 120);
  doc.setFontSize(9);
  doc.text("BILLED TO", 40, 140);
  doc.text("STUDIO", 310, 140);

  doc.setTextColor(30, 30, 36);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(booking.userName, 40, 160);
  doc.text(booking.studioTitle, 310, 160, { maxWidth: 245 });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(booking.userEmail, 40, 178);
  doc.text(`Host: ${booking.hostName}`, 310, 196);
  doc.text(booking.studioLocation, 310, 178, { maxWidth: 245 });

  doc.setTextColor(110, 110, 120);
  doc.text(`Issued: ${formatShortDate(new Date().toISOString())}`, 40, 196);

  // Table
  let y = 250;
  doc.setFillColor(244, 244, 247);
  doc.rect(40, y - 18, width - 80, 28, "F");
  doc.setTextColor(30, 30, 36);
  doc.setFont("helvetica", "bold");
  doc.text("Description", 52, y);
  doc.text("Amount", width - 52, y, { align: "right" });

  const rows = [
    [`Session on ${formatDate(booking.date)}`, ""],
    [`${formatTime(booking.startTime)} to ${formatTime(booking.endTime)}`, ""],
    [`Studio rental: ${booking.hours} hr x ${money(booking.hourlyRate)}`, money(booking.subtotal)],
    ["Refundable security deposit", money(booking.securityDeposit)],
  ];

  doc.setFont("helvetica", "normal");
  y += 30;
  rows.forEach(([label, amount]) => {
    doc.text(label, 52, y);
    if (amount) doc.text(amount, width - 52, y, { align: "right" });
    y += 26;
  });

  // Total
  doc.setDrawColor(220, 220, 226);
  doc.line(40, y - 8, width - 40, y - 8);
  y += 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text("Total", 52, y);
  doc.text(money(booking.total), width - 52, y, { align: "right" });

  // Status
  y += 40;
  doc.setFontSize(10);
  doc.setTextColor(110, 110, 120);
  doc.setFont("helvetica", "normal");
  doc.text(`Booking status: ${booking.status}`, 40, y);
  if (booking.notes) doc.text(`Notes: ${booking.notes}`, 40, y + 18, { maxWidth: width - 80 });

  // Footer
  doc.setFontSize(9);
  doc.text(
    "Thank you for booking with StudioSpace. The security deposit is returned by the host after your session.",
    40,
    780,
    { maxWidth: width - 80 },
  );

  return { doc, invoiceNumber };
}

export async function downloadInvoice(booking) {
  const { jsPDF } = await import("jspdf");
  const { doc, invoiceNumber } = buildInvoice(jsPDF, booking);
  doc.save(`StudioSpace-invoice-${invoiceNumber}.pdf`);
}

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// ---------------------- PDF EXPORT ----------------------
export const exportOrderToPDF = (order: any) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Billing Receipt", 14, 20);

  doc.setFontSize(12);
  doc.text(`Customer: ${order.customer.name}`, 14, 30);
  doc.text(`Email: ${order.customer.email}`, 14, 38);
  doc.text(`Billing Address: ${order.billingAddress}`, 14, 46);
  doc.text(`Payment: ${order.paymentMethod} (${order.paymentStatus})`, 14, 54);

  autoTable(doc, {
    startY: 65,
    head: [["Medicine", "Qty", "Price"]],
    body: order.medicines.map((m: any) => [
      m.med.name,
      m.qty,
      `KES ${m.price}`,
    ]),
  });

  const finalY = (doc as any).lastAutoTable.finalY;

  doc.text(
    `Total Amount: KES ${order.totalAmount}`,
    14,
    finalY + 10
  );

  doc.save(`Order_${order._id}.pdf`);
};

// ---------------------- EXCEL EXPORT ----------------------
export const exportOrderToExcel = (order: any) => {
  const worksheetData = [
    ["Customer", order.customer.name],
    ["Email", order.customer.email],
    ["Billing Address", order.billingAddress],
    ["Payment Method", order.paymentMethod],
    ["Payment Status", order.paymentStatus],
    [],
    ["Medicine", "Quantity", "Price"],
    ...order.medicines.map((m: any) => [m.med.name, m.qty, m.price]),
    [],
    ["Total Amount", order.totalAmount],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, "Order Details");

  XLSX.writeFile(workbook, `Order_${order._id}.xlsx`);
};

import React, { useState, useEffect } from "react";
import { TextField, Button, Typography, Grid } from "@mui/material";
import QRCode from "qrcode.react";
import jsPDF from "jspdf";

function formatASN(asn) {
  return `ASN${asn.toString().padStart(7, "0")}`;
}

function QRCodeGenerator() {
  const [startASN, setStartASN] = useState("");
  const [numASNs, setNumASNs] = useState("");
  const [qrcodes, setQrcodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isLoading) {
      generatePDF(qrcodes);
      setIsLoading(false);
    }
  }, [isLoading, qrcodes]);

  const handleGenerateQR = () => {
    const start = parseInt(startASN, 10);
    const num = parseInt(numASNs, 10);
    const codes = [];

    if (!isNaN(start) && !isNaN(num) && num > 0) {
      setIsLoading(true);
      for (let i = 0; i < num; i++) {
        const asn = start + i;
        codes.push(formatASN(asn));
      }
      setQrcodes(codes);
    }
  };

  const generatePDF = (codes) => {
    const doc = new jsPDF();
    const fileName = `${codes[0]}-${codes[codes.length - 1]}.pdf`;

    codes.forEach((code, index) => {
      if (index > 0) doc.addPage();
      // Calculate center positions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const qrCodeWidth = 80;
      const qrCodeHeight = 80;
      const qrCodeX = (pageWidth - qrCodeWidth) / 2;
      const qrCodeY = (pageHeight - qrCodeHeight - 40) / 2; // Subtract 20 for ASN text

      // Generate QR code image as data URL
      const qrCodeDataURL = document.getElementById(`qrcode-${index}`).toDataURL("image/png");

      // Add the QR code image to the PDF
      doc.addImage(qrCodeDataURL, "PNG", qrCodeX, qrCodeY, qrCodeWidth, qrCodeHeight);

      // Add ASN text below QR code
      doc.setFontSize(40);
      doc.text(code, pageWidth / 2, qrCodeY + qrCodeHeight + 15, null, null, "center");
    });

    doc.save(fileName);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        ASN PDF Generator
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Start ASN"
            variant="outlined"
            fullWidth
            type="number"
            value={startASN}
            onChange={(e) => setStartASN(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Number of ASNs"
            variant="outlined"
            fullWidth
            type="number"
            value={numASNs}
            onChange={(e) => setNumASNs(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleGenerateQR} style={{float:"right"}}>
            Generate PDF
          </Button>
        </Grid>
      </Grid>
      <div style={{ display: "none" }}>
        {qrcodes.map((code, index) => (
          <div key={index}>
            <QRCode id={`qrcode-${index}`} value={code} size={256} />
            <Typography variant="subtitle1">{code}</Typography>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QRCodeGenerator;

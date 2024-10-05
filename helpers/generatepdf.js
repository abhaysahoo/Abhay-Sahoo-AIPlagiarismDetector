import jsPDF from 'jspdf';

export const generatePDF = (report) => {
    const doc = new jsPDF();

    const pageWidth = doc.internal.pageSize.getWidth();
    const marginLeft = 20;  // Left margin in mm
    const marginRight = 20; // Right margin in mm
    const contentWidth = pageWidth - marginLeft - marginRight; // Width for the content

    // Title and Plagiarism Percentage
    doc.setFontSize(16);
    doc.text('Plagiarism Report', marginLeft, 20);
    doc.text(`Originality Percentage: ${(100 - report.plagiarismPercentage).toFixed(2)}%`, marginLeft, 30);
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text('Texts in red color are flagged as plagiarised', marginLeft, 35);

    // Generate the content with highlighted plagiarized sections
    doc.setFontSize(12);
    doc.setFont("monosans", "normal");
    let yOffset = 50;

    report.sentenceReport.forEach(({ sentence, plagiarismInfo }) => {
        const { st, ed } = plagiarismInfo;

        if (st === -1 && ed === -1) {
            // Split sentence to fit within content width
            const lines = doc.splitTextToSize(sentence, contentWidth);
            doc.text(lines, marginLeft, yOffset);
            yOffset += lines.length * 10; // Adjust yOffset based on number of lines
        } else {
            const beforePlagiarized = sentence.slice(0, st);
            const plagiarized = sentence.slice(st, ed + 1);
            const afterPlagiarized = sentence.slice(ed + 1);

            if (beforePlagiarized) {
                // Normal text before the plagiarized part
                const beforeLines = doc.splitTextToSize(beforePlagiarized, contentWidth);
                doc.text(beforeLines, marginLeft, yOffset);
                yOffset += beforeLines.length * 5;
            }

            // Highlighted plagiarized text
            doc.setTextColor(255, 0, 0); // Red color for plagiarized text
            const plagiarizedLines = doc.splitTextToSize(plagiarized, contentWidth);
            doc.text(plagiarizedLines, marginLeft, yOffset);
            yOffset += plagiarizedLines.length * 5;
            doc.setTextColor(0, 0, 0); // Reset to default color

            if (afterPlagiarized) {
                // Normal text after the plagiarized part
                const afterLines = doc.splitTextToSize(afterPlagiarized, contentWidth);
                doc.text(afterLines, marginLeft, yOffset);
                yOffset += afterLines.length * 10;
            }
        }

        if (yOffset > doc.internal.pageSize.getHeight() - 20) {  // Check if we need a new page
            doc.addPage();
            yOffset = 20; // Reset yOffset for new page
        }
    });

    // Save the PDF to URL for viewing
    const pdfBlob = doc.output('blob');
    return URL.createObjectURL(pdfBlob);
}
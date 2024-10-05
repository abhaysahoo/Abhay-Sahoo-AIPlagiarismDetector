import { useState } from 'react';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Import the styles provided by the react-pdf-viewer packages
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

import ProgressBarComponent from './ProgressBarComponent';
import { Button } from '../ui/button';
import { generatePDF } from '@/helpers/generatepdf';

const ReportDisplayComponent = ({ report }) => {
    const defaultLayoutPluginInstance = defaultLayoutPlugin();
    const [pdfUrl, setPdfUrl] = useState(null);

    const generateReport = () => {
        const pdfUrl = generatePDF(report);
        setPdfUrl(pdfUrl);
    };

    return (
        <div className="flex flex-col items-center gap-4 mt-8">
            <h5>Plagiarism Check</h5>

            {/* Progress bar */}
            <ProgressBarComponent percentage={report.plagiarismPercentage} />
            
            <Button className="hover:bg-primary-hover shadow-sm" onClick={generateReport}>
                Generate Report
            </Button>

            {/* Generated pdf viewer */}
            {pdfUrl && (
                <div className="w-full mt-8 h-[750px]">
                    <Worker workerUrl="/workerfiles/pdf.worker.min.js">
                        <Viewer 
                            fileUrl={pdfUrl} 
                            plugins={[
                                defaultLayoutPluginInstance,
                            ]}
                        />
                    </Worker>
                </div>
            )}
        </div>
    );
};

export default ReportDisplayComponent;

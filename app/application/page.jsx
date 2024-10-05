"use client";

import { useState } from 'react';
import FileUploadAndProcessingComponent from '@/components/shared/FileUploadAndProcessingComponent';
import ReportDisplayComponent from '@/components/shared/ReportDisplayComponent';
import Image from 'next/image';

export default function ApplicationPage() {
    const [plagiarismReport, setPlagiarismReport] = useState(null);
    const [loadingResult, setLoadingResult] = useState(false);

    return (
        <div className='wrapper mt-24'> 
            <h3 className="font-bold text-center m-6 md:text-3xl text-2xl">Check Plagiarism in a File</h3>

            {/*File Upload And Processing Section */}
            <FileUploadAndProcessingComponent 
                setPlagiarismReport={setPlagiarismReport} 
                setLoadingResult={setLoadingResult} 
            />

            {/* Show animated loading indicator */}
            {loadingResult && (
                <div className="flex justify-center items-center flex-col gap-4 mt-24">
                    <Image 
                        src="/gifs/settings.gif"
                        alt="settings loader"
                        width={60}
                        height={60}
                    />
                    <h5 className="text-stone-primary text-lg md:text-xl">Please wait. It will take a few seconds...</h5>
                </div>
            )}

            {/* Empty graphics on initial render */}
            {!loadingResult && !plagiarismReport && (
                <div className="flex justify-center mt-20">
                    <Image 
                        src="/graphics/resting-graphics.svg"
                        alt="resting illusration"
                        width={200}
                        height={200}
                    />
                </div>
            )}

            {/* Plagiarism Report Display */}
            {!loadingResult && plagiarismReport && (
                <ReportDisplayComponent report={plagiarismReport} />
            )}
        </div>
    );
}

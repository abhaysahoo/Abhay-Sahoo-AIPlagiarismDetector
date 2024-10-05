import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '../ui/button';
import Link from 'next/link';

const FileUploadAndProcessingComponent = ({ setPlagiarismReport, setLoadingResult }) => {
    const [fileName, setFileName] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState(null);

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        if (rejectedFiles.length !== 0) {
            setError('Only .pdf or .docx file with size less than 50mb will be accepted');
            return;
        }

        if (acceptedFiles.length === 0) return; // No files accepted

        const file = acceptedFiles[0];
        setFileName(file);
        setPlagiarismReport(null);
        setError(null);
    }, []);

    const handleFileProcessing = async (e) => {
        setIsProcessing(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', fileName);

        setLoadingResult(true);

        try {
            const response = await fetch('/api/application', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            // console.log(result);

            if (!response.ok) {
                setError(result.message);
            }

            // console.log(result.message);
            setPlagiarismReport(result.plagiarismReport);
        } catch (error) {
            console.error('Error while processing plagiarism check: ', error);
        } finally {
            setLoadingResult(false);
            setIsProcessing(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
        },
        maxFiles: 1,
        maxSize: 1024 * 1024 * 50, //50 megabytes
    });

    return (
        <div className="w-full max-w-md mx-auto flex flex-col gap-4">
            {/* dropzone to for drag-and-drop */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed p-6 text-center 
                rounded-lg hover:cursor-pointer hover:bg-blue-50 hover:border-blue-400 ${isDragActive ? "border-blue-400 bg-blue-50" : "border-border"
                    }`}
            >
                <input {...getInputProps()} />
                {
                    fileName ? (
                        <div className='text-stone-primary'>
                            <p>Selected file: {fileName.name}</p>
                            <p>Click here again to replace</p>
                        </div>
                    ) : (
                        <div className='text-stone-primary'>
                            <p>Drag &amp; Drop a file here, or <Link href="#" className='text-blue-400 underline'>Browse</Link> one</p>
                            <p>Max file size: 50mb, Supported formats: .pdf, .docx</p>
                        </div>
                    )
                }
            </div>

            {/* button to invoke backend API */}
            {fileName && (
                <div className="flex items-center justify-end">
                    <Button
                        onClick={handleFileProcessing}
                        disabled={isProcessing}
                        className={`${isProcessing ? "opacity-50 cursor-not-allowed" : "hover:bg-primary-hover"} shadow-sm`}
                    >
                        {isProcessing ? "Processing..." : "Process"}
                    </Button>
                </div>
            )}

            {error && <p className="text-destructive text-center">{error}</p>}
        </div>
    );
};

export default FileUploadAndProcessingComponent;

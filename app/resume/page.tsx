'use client';

import { useAppContext } from '../components/AppContext';
import { IProject } from '../../server/models/project';

export default function ResumePage() {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = '/cv.pdf';
        link.download = 'Jenny-Resume.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    return (
        <>
            <h1>Resume</h1>
            {/* <iframe
                src="/cv.pdf"
                title="Resume PDF"
                className="h-[85vh] w-full rounded border"
            /> */}
            <button onClick={handleDownload}>Download Resume</button>
        </>
    );
}
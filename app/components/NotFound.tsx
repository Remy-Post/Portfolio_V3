import Link from "next/link";

export const NOT_FOUND_PAGE = ({ errorMessage = 'Page Not Found' }: { errorMessage?: string }): React.ReactNode => {
    return (
        <>
            <h1>404 - {errorMessage}</h1>
            <p>The page you are looking for does not exist.</p>
            <p>Return to the <Link href="/" className="text-blue-500">home page</Link>.</p>
        </>
    );
}
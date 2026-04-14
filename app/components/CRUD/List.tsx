'use client';

import { useRouter } from 'next/navigation';

export default function List({ items = [], basePath }: { items?: any[], basePath: string }) {

    const router = useRouter();

    const handleClick = (item: any) => {
        router.push(`${basePath}/${item._id}`);
    }

    return (
        <ul>
            {items.map((item) => (
                <li key={Math.random().toString()} onClick={() => handleClick(item)}>{item.name}</li>
            ))}
        </ul>
    );
}

import React from 'react'
import ListingsTable from './ListingsTable';
import { columns } from "./columns";

function ListingsContent({data, favorites}: {favorites: any, data: any}) {
    
    return (
        <div>
            <ListingsTable data={data} columns={columns} />
            <pre>
                <code>{JSON.stringify(favorites, null, 2)}</code>
            </pre>
        </div>
    );
}

export default ListingsContent
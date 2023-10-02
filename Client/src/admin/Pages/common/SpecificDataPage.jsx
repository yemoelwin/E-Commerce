import React from 'react';
import DataTable from '../../../components/common/DataTable';// Import your table component

const SpecificDataPage = () => {
  // Define your table columns and data
    const columns = [
        {
        Header: 'Products',
        accessor: 'product', // The data field to display
        },
        {
        Header: 'Email',
        accessor: 'email',
        },
        // Add more columns as needed
    ];

    const data = [
        {
        name: 'John Doe',
        email: 'john@example.com',
        },
        {
        name: 'Jane Smith',
        email: 'jane@example.com',
        },
        // Add more data rows as needed
    ];

    return (
        <div>
        <h3>Specific Data Page</h3>
        <DataTable columns={columns} data={data} />
        </div>
    );
};

export default SpecificDataPage;

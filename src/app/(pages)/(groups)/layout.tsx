import React from 'react';

const layout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <section className='py-10 px-5'>{children}</section>
    );
};

export default layout;
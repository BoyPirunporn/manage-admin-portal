import React from 'react';

const layout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <section className='py-10 px-5 md:px-10'>{children}</section>
    );
};

export default layout;
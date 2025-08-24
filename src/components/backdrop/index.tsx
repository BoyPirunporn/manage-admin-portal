
const Backdrop = () => {
    return (
        <div className='absolute h-screen w-full pointer-events-auto  bg-accent/50 top-0 z-10'>
            <div className="h-full w-full flex justify-center items-center flex-col">
                <div className='loader ' />
            </div>
        </div>
    );
};

export default Backdrop;
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const ActivateSession = () => {
    return (
        <Card className='bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm '>
            <CardHeader>
                <CardTitle className='md:text-xl'>Activate Session</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-10 ">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col gap-1 justify-center">
                                <h3 className="text-base font-bold">MacBook Pro</h3>
                                <p className='text-sm md:text-sm text-gray-400'>San Francisco, CA • Active now</p>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col gap-1 justify-center">
                                <h3 className="text-base font-bold">iPhone 12</h3>
                                <p className='text-sm md:text-sm text-gray-400'>New York, NY • 2 days ago</p>
                            </div>
                        </div>
                        <Button variant={"outline"}>
                            Revoke
                        </Button>
                    </div>
                    
                </div>
            </CardContent>
        </Card>
    );
};

export default ActivateSession;
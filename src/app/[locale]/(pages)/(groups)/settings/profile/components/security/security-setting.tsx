import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RenderIcon from '@/components/ui/render-icon';

const SecuritySetting = () => {
    return (
        <Card className='bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm '>
            <CardHeader>
                <CardTitle className='md:text-xl'>Security Setting</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-10 ">
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col gap-1 justify-center">
                                <h3 className="text-base font-bold">Two-Factor Authorization</h3>
                                <p className='text-sm md:text-sm text-gray-400'>Add an extra layer of security to your account</p>
                            </div>
                        </div>
                        <Button variant={"outline"}>
                            <RenderIcon name="Shield"/>
                            Enable
                        </Button>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row gap-2">
                            <div className="flex flex-col gap-1 justify-center">
                                <h3 className="text-base font-bold">Password</h3>
                                <p className='text-sm md:text-sm text-gray-400'>Last change 3 months ago</p>
                            </div>
                        </div>
                        <Button variant={"outline"}>
                            <RenderIcon name="Key"/>
                            Change
                        </Button>
                    </div>
                    
                </div>
            </CardContent>
        </Card>
    );
};

export default SecuritySetting;
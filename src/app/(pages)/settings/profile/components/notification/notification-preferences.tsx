import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RenderIcon from '@/components/ui/render-icon';

const NotificationPreferences = () => {
    return (
        <Card className='bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm '>
            <CardHeader>
                <CardTitle className='md:text-xl'>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-10 ">
                    <RenderItem title='Email Notifications' description='Receive notifications about account activity'/>
                    <RenderItem title='Push Notifications' description='Receive notifications about account activity'/>
                    <RenderItem title='Monthly newsletter' description='Receive notifications about account activity'/>
                    <RenderItem title='Security alert' description='Receive notifications about account activity'/>
                </div>
            </CardContent>
        </Card>
    );
};

const RenderItem = ({ title, description }: { title: string, description: string; }) => {
    return (
        <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2">
                <div className="flex flex-col gap-1 justify-center">
                    <h3 className="text-base font-bold">{title}</h3>
                    <p className='text-sm md:text-sm text-gray-400'>{description}</p>
                </div>
            </div>
            <Button variant={"outline"}>Configuration</Button>
        </div>
    );
};

export default NotificationPreferences;
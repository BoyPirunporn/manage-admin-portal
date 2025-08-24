import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import RenderIcon from '@/components/ui/render-icon';

const ProfileConnect = () => {
  return (
    <Card className='bg-card text-card-foreground flex flex-col gap-6 rounded-xl border shadow-sm '>
      <CardHeader>
        <CardTitle className='md:text-xl'>Connected Account</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-10 ">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2">
              <div className="p-2 rounded-full bg-gray-400/30 shadow">
                <div className="w-10 h-10 flex justify-center items-center">
                  <RenderIcon name="Star" />
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center">
                <h3 className="text-lg font-bold">Github</h3>
                <p className='text-base md:text-sm'>Connected</p>
              </div>
            </div>
            <Button variant={"outline"}>Disconnected</Button>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2">
              <div className="p-2 rounded-full bg-gray-400/30 shadow">
                <div className="w-10 h-10 flex justify-center items-center">
                  <RenderIcon name="Star" />
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center">
                <h3 className="text-lg font-bold">Google</h3>
                <p className='text-base md:text-sm'>Not Connected</p>
              </div>
            </div>
            <Button variant={"default"}>Connected</Button>
          </div>
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-2">
              <div className="p-2 rounded-full bg-gray-400/30 shadow">
                <div className="w-10 h-10 flex justify-center items-center">
                  <RenderIcon name="Star" />
                </div>
              </div>
              <div className="flex flex-col gap-1 justify-center">
                <h3 className="text-lg font-bold">Twitter</h3>
                <p className='text-base md:text-sm'>Not Connected</p>
              </div>
            </div>
            <Button variant={"default"}>Connected</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileConnect;
"use client";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RenderIcon from '@/components/ui/render-icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import ProfileDetail from './components/profile-detail';
import ProfileConnect from './components/profile-connect';
import SecuritySetting from './components/security/security-setting';
import ActivateSession from './components/security/activate-session';
import NotificationPreferences from './components/notification/notification-preferences';
import Heading from '@/components/heading';

const ProfilePage = () => {
  return (
    <div className='md:px-[5rem] flex flex-col '>
      <div className="flex flex-row gap-3">
        <Avatar className='w-20 h-20'>
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <Heading title={'Account setting'} description='Manage your account settings and preferences'/>
      </div>
      <div className="flex flex-col gap-2 space-y-6 mt-[2rem]">
        <ProfileDetail />
        {/* <ProfileConnect /> */}
      </div>
      {/* <Tabs defaultValue="profile" className="flex flex-col gap-2 space-y-6 mt-[2rem]">
        <TabsList className='text-muted-foreground [&_[data-state=inactive]]:cursor-pointer inline-flex items-center rounded-lg h-auto w-full justify-start gap-6 bg-transparent p-0'>
          <TabsTrigger value="profile" className='transition-all duration-300 data-[state=active]:text-primary data-[state=active]:border-primary  data-[state=active]:scale-105'>
            <RenderIcon name="User" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security" className='transition-all duration-300 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:scale-105'>
            <RenderIcon name='Lock' />
            Security
          </TabsTrigger>
          <TabsTrigger value="notification" className='transition-all duration-300 data-[state=active]:text-primary data-[state=active]:border-primary data-[state=active]:scale-105'>
            <RenderIcon name="Bell" />
            Notification
          </TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className='data-[state=inactive]:hidden animate-fadeIn flex-1 outline-none space-y-6'>
          <ProfileDetail />
          <ProfileConnect />
        </TabsContent>
        <TabsContent value="security" className='data-[state=inactive]:hidden animate-fadeIn flex-1 outline-none space-y-6'>
          <SecuritySetting />
          <ActivateSession />
        </TabsContent>
        <TabsContent value="notification" className='data-[state=inactive]:hidden animate-fadeIn flex-1 outline-none space-y-6'>
          <NotificationPreferences />
        </TabsContent>
      </Tabs> */}
    </div>
  );
};

export default ProfilePage;
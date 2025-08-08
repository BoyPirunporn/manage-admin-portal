import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { FormInputField } from '@/components/ui/form-input';
import SocialComponent from './SocialComponent';
const signUpSchema = z.object({
    name: z.string().min(0).max(50),
    email: z.string().min(1).max(50),
    password: z.string().min(1).max(50)
});

type SignUp = z.infer<typeof signUpSchema>;

const SignUpComponent = ({
    active,
    handleToggle
}: Readonly<{
    active: Boolean;
    handleToggle: () => void;
}>) => {
    const form = useForm<SignUp>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });
    return (
        <div className={cn(
            "signup-container",
            active && "signup-active"
        )}>
            <Form {...form}>
                <form className="form-container">
                    <h1 className="text-xl font-bold">Create Account</h1>
                    <div className='flex flex-col gap-3 w-full'>
                         <FormInputField control={form.control} name={"name"} label={'Name'}/>
                         <FormInputField control={form.control} name={"email"} label={'Email'}/>
                         <FormInputField control={form.control} type='password' name={"password"} label={'Password'}/>
                        <SocialComponent/>
                        <Button>Sign Up</Button>
                    </div>
                    <p className='text-xs block md:hidden pt-3'>You have already account? <span onClick={handleToggle} className='cursor-pointer'>SignIn</span>.</p>
                </form>
            </Form>
        </div>
    );
};

export default SignUpComponent;
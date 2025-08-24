import { Logo } from "@/components/block/Logo";
import { LoginButton } from "@/components/login-form";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { getSession } from "auth";
import { redirect } from "next/navigation";


export default async function LoginPage() {
    const session = await getSession();
    if (session) {
        redirect('/dashboard');
    }
    
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Logo />
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Sign in to your account to continue</p>
                </CardContent>
                <CardFooter>
                    <LoginButton text="Sign in" redirectUrl="/dashboard" />
                </CardFooter>
            </Card>
        </div>
  );
}
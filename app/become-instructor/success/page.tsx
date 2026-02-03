import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
      <div className="bg-green-100 p-4 rounded-full mb-6">
        <CheckCircle2 className="w-12 h-12 text-green-600" />
      </div>
      
      <h1 className="text-2xl font-bold mb-2">Application Submitted!</h1>
      <p className="text-muted-foreground max-w-lg mb-6">
        Your teaching application is currently under review. 
        Please check your email and web notifications periodically. 
        A decision will be made within 2 weeks from the submission date.
      </p>

      <div className="flex gap-4">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
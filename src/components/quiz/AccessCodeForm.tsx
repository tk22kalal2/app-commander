
import { useState } from "react";
import { toast } from "sonner";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from "@/components/ui/card";

interface AccessCodeFormProps {
  quizTitle: string;
  onVerify: (code: string) => Promise<boolean>;
}

export const AccessCodeForm = ({ quizTitle, onVerify }: AccessCodeFormProps) => {
  const [accessCode, setAccessCode] = useState("");
  const [verifyingAccess, setVerifyingAccess] = useState(false);

  const handleVerifyAccessCode = async () => {
    if (!accessCode.trim()) {
      toast.error("Please enter the access code");
      return;
    }

    setVerifyingAccess(true);
    
    try {
      const isValid = await onVerify(accessCode.trim());
      
      if (isValid) {
        toast.success("Access code verified!");
      } else {
        toast.error("Invalid access code. Please try again.");
      }
    } catch (error: any) {
      console.error("Error verifying access code:", error);
      toast.error("Error verifying access code");
    } finally {
      setVerifyingAccess(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-full flex justify-center mb-4">
            <Lock className="h-12 w-12 text-medblue" />
          </div>
          <CardTitle className="text-2xl">{quizTitle}</CardTitle>
          <CardDescription>
            This quiz is private. Please enter the access code to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder="Enter access code"
                value={accessCode}
                onChange={(e) => setAccessCode(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>
            <Button 
              className="w-full" 
              onClick={handleVerifyAccessCode}
              disabled={verifyingAccess}
            >
              {verifyingAccess ? "Verifying..." : "Access Quiz"}
            </Button>
            <div className="text-center text-sm">
              <p className="text-muted-foreground">
                Contact the quiz creator for the access code.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

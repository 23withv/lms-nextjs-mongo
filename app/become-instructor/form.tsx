"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Rocket, Youtube, Code2, Layers, Wrench } from "lucide-react"; 
import { useActionState } from "react";
import { submitInstructorRequest } from "@/actions/instructor/instructor-request";

export default function BecomeInstructorForm() {
  const [state, action, isPending] = useActionState(submitInstructorRequest, { error: "", success: false, inputs: {} });

  return (
    <div className="container max-w-3xl mx-auto py-10 space-y-8">
      <div className="bg-primary/5 border border-primary/10 rounded-xl p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-white shadow-sm rounded-full mb-2">
            <Rocket className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Instructor Application</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Share your expertise. We are looking for passionate instructors in technology and business.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Professional Profile</CardTitle>
          <CardDescription>Please provide accurate details about your skills.</CardDescription>
        </CardHeader>
        <CardContent>
            {state?.error && (
                <div className="bg-destructive/10 text-destructive p-3 rounded-md text-sm mb-6 border border-destructive/20">
                    {state.error}
                </div>
            )}
            
            {state?.success && (
                 <div className="bg-green-50 text-green-700 p-4 rounded-md text-sm mb-6 border border-green-200">
                    ✅ {state.message} <br/> Refresh the page to see your status.
                </div>
            )}

            <form action={action} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Teaching Experience</Label>
                        <Select name="experience" defaultValue={state.inputs?.experience}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="No Experience">No Experience</SelectItem>
                                <SelectItem value="Private Tutoring">Private Tutoring</SelectItem>
                                <SelectItem value="Professional Instructor">Professional Instructor</SelectItem>
                                <SelectItem value="Online Course Creator">Course Creator</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>LinkedIn URL (Optional)</Label>
                        <Input 
                            name="linkedin" 
                            placeholder="linkedin.com/in/you"
                            defaultValue={state.inputs?.linkedin}
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <Label className="text-base font-semibold">Technical Expertise</Label>
                    <p className="text-sm text-muted-foreground -mt-2 mb-2">Separate items with commas (e.g. React, Vue)</p>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-muted-foreground flex items-center gap-2">
                                <Code2 className="w-3 h-3" /> Programming Languages
                            </Label>
                            <Input 
                                name="languages" 
                                placeholder="JS, Python, PHP..." 
                                defaultValue={state.inputs?.languages}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-xs uppercase text-muted-foreground flex items-center gap-2">
                                <Layers className="w-3 h-3" /> Frameworks
                            </Label>
                            <Input 
                                name="frameworks" 
                                placeholder="React, Laravel, Django..." 
                                defaultValue={state.inputs?.frameworks}
                            />
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <Label className="text-xs uppercase text-muted-foreground flex items-center gap-2">
                                <Wrench className="w-3 h-3" /> Tools & Databases
                            </Label>
                            <Input 
                                name="tools" 
                                placeholder="Git, Docker, MongoDB, Figma, AWS..." 
                                defaultValue={state.inputs?.tools}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Video Portfolio (YouTube)</Label>
                        <div className="grid md:grid-cols-2 gap-3">
                            <div className="relative">
                                <Youtube className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    name="video1" 
                                    placeholder="https://youtu.be/..." 
                                    className="pl-9" 
                                    required 
                                    defaultValue={state.inputs?.video1}
                                />
                            </div>
                            <div className="relative">
                                <Youtube className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input 
                                    name="video2" 
                                    placeholder="https://youtu.be/..." 
                                    className="pl-9" 
                                    required 
                                    defaultValue={state.inputs?.video2}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Motivation</Label>
                        <Textarea 
                            name="motivation" 
                            placeholder="Why do you want to teach here?" 
                            className="min-h-25" 
                            required 
                            defaultValue={state.inputs?.motivation}
                        />
                    </div>
                </div>

                <div className="pt-2">
                    <Button type="submit" className="w-full" size="lg" disabled={isPending}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                            </>
                        ) : (
                            "Submit Application"
                        )}
                    </Button>
                </div>

            </form>
        </CardContent>
      </Card>
    </div>
  );
}
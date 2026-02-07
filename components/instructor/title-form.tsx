"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCourse } from "@/actions/instructor/course";
import { toast } from "sonner";

interface TitleFormProps {
  initialData: {
    title: string;
  };
  courseId: string;
}

export const TitleForm = ({ initialData, courseId }: TitleFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialData.title);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const toggleEdit = () => setIsEditing((current) => !current);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const result = await updateCourse(courseId, { title });

    if (result.success) {
      toast.success("Course title updated");
      toggleEdit();
      router.refresh();
    } else {
      toast.error(result.error || "Something went wrong");
    }
    
    setIsLoading(false);
  };

  return (
    <div className="mt-6 border bg-muted/50 rounded-md p-4">
      <div className="font-medium flex items-center justify-between text-foreground">
        Course title
        <Button onClick={toggleEdit} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              Edit title
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <p className="text-sm mt-2 text-foreground">
          {initialData.title}
        </p>
      )}
      {isEditing && (
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          <Input
            disabled={isLoading}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. 'Advanced Web Development'"
            className="bg-background text-foreground"
          />
          <div className="flex items-center gap-x-2">
            <Button disabled={isLoading || !title} type="submit">
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
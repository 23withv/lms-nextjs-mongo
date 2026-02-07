"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useTransition } from "react";
import { updateCourse } from "@/actions/instructor/course";
import { Loader2, Wand2, Info } from "lucide-react";
import { FileUpload } from "@/components/shared/file-upload";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface EditCourseFormProps {
    initialData: any;
    categories: { id: string; name: string }[];
}

export default function EditCourseForm({ initialData, categories }: EditCourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: initialData.title || "",
    slug: initialData.slug || "",
    categoryId: initialData.categoryId || "",
    level: initialData.level || "Beginner",
    status: initialData.status || "Draft",
    price: initialData.price || 0,
    duration: initialData.duration || 0,
    smallDescription: initialData.smallDescription || "",
    description: initialData.description || "",
    thumbnail: initialData.thumbnail || "",
  });

  const handleChange = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const generateSlug = () => {
    const newSlug = formData.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    handleChange("slug", newSlug);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
        try {
            const result = await updateCourse(initialData._id, formData);
            if (result.success) {
                toast.success("Course updated successfully");
                router.refresh();
            } else {
                setError(result.error || "Something went wrong");
                toast.error(result.error || "Failed to update");
            }
        } catch (err) {
            setError("Internal error occurred");
        }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-8">
        {error && (
            <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-3 text-destructive text-sm font-medium border border-destructive/20">
                <Info className="w-5 h-5 shrink-0" />
                {error}
            </div>
        )}

        <div className="space-y-8">
            <section className="space-y-4">
                <h2 className="text-xl font-semibold">General Information</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                            id="title"
                            disabled={isPending}
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            className="bg-background"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="slug">Course Slug</Label>
                        <div className="flex gap-2">
                            <Input
                                id="slug"
                                disabled={isPending}
                                value={formData.slug}
                                onChange={(e) => handleChange("slug", e.target.value)}
                                className="bg-background"
                            />
                            <Button 
                                type="button" 
                                variant="outline" 
                                onClick={generateSlug}
                                disabled={isPending || !formData.title}
                                className="shrink-0"
                            >
                                <Wand2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="smallDescription">Short Description</Label>
                        <Textarea 
                            id="smallDescription"
                            disabled={isPending}
                            value={formData.smallDescription}
                            onChange={(e) => handleChange("smallDescription", e.target.value)}
                            className="h-24 resize-none bg-background"
                            maxLength={255}
                        />
                        <p className="text-xs text-muted-foreground text-right">Max 255 characters</p>
                    </div>

                    <div className="col-span-2 space-y-2">
                        <Label htmlFor="description">Full Description</Label>
                        <Textarea 
                            id="description"
                            disabled={isPending}
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            className="min-h-40 bg-background"
                        />
                    </div>
                </div>
            </section>

            <div className="border-t" />

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Visual Assets</h2>
                <div className="space-y-2">
                    <Label>Course Thumbnail</Label>
                    <div className="bg-muted/30 border border-dashed rounded-xl p-6 hover:bg-muted/50 transition-colors">
                        <FileUpload
                            value={formData.thumbnail}
                            onChange={(url) => handleChange("thumbnail", url)}
                            onRemove={() => handleChange("thumbnail", "")}
                            resourceType="image"
                            disabled={isPending}
                        />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                        16:9 Aspect Ratio. Max 4MB.
                    </p>
                </div>
            </section>

            <div className="border-t" />

            <section className="space-y-4">
                <h2 className="text-xl font-semibold">Configuration & Pricing</h2>
                <div className="grid gap-6 md:grid-cols-3">
                    <div className="space-y-2">
                        <Label htmlFor="categoryId">Category</Label>
                        <Select 
                            disabled={isPending} 
                            value={formData.categoryId} 
                            onValueChange={(val) => handleChange("categoryId", val)}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="level">Difficulty Level</Label>
                        <Select 
                            disabled={isPending} 
                            value={formData.level}
                            onValueChange={(val) => handleChange("level", val)}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Beginner">Beginner</SelectItem>
                                <SelectItem value="Intermediate">Intermediate</SelectItem>
                                <SelectItem value="Advanced">Advanced</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select 
                            disabled={isPending} 
                            value={formData.status}
                            onValueChange={(val) => handleChange("status", val)}
                        >
                            <SelectTrigger className="bg-background">
                                <SelectValue placeholder="Select Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Draft">Draft</SelectItem>
                                <SelectItem value="Published">Published</SelectItem>
                                <SelectItem value="Archive">Archived</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (Minutes)</Label>
                        <Input
                            id="duration"
                            type="number"
                            min="0"
                            disabled={isPending}
                            value={formData.duration}
                            onChange={(e) => handleChange("duration", Number(e.target.value))}
                            className="bg-background"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="price">Price (IDR)</Label>
                        <Input
                            id="price"
                            type="number"
                            min="0"
                            disabled={isPending}
                            value={formData.price}
                            onChange={(e) => handleChange("price", Number(e.target.value))}
                            className="bg-background"
                        />
                    </div>
                </div>
            </section>
        </div>

        <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/95 backdrop-blur z-50">
            <div className="container max-w-4xl mx-auto flex justify-end">
                <Button type="submit" size="lg" className="min-w-50" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving Changes...
                        </>
                    ) : (
                        "Save Changes"
                    )}
                </Button>
            </div>
        </div>
    </form>
  );
}
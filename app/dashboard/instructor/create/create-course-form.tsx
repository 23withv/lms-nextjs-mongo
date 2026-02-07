"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useActionState, useState } from "react";
import { createCourse } from "@/actions/instructor/course";
import Link from "next/link";
import { Loader2, Wand2, Info, ArrowLeft } from "lucide-react";
import { FileUpload } from "@/components/shared/file-upload";

interface CreateCourseFormProps {
    categories: { id: string; name: string }[];
}

export default function CreateCourseForm({ categories }: CreateCourseFormProps) {
  const [state, action, isPending] = useActionState(createCourse, {});
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [thumbnail, setThumbnail] = useState("");

  const generateSlug = () => {
    const newSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setSlug(newSlug);
  };

  return (
    <form action={action} className="w-full relative">
        <div className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur supports-backdrop-filter:bg-background/60">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/instructor/courses" className="rounded-full p-2 hover:bg-muted transition-colors">
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                </Link>
                <div className="flex flex-col">
                    <h1 className="text-lg font-semibold tracking-tight">Create New Course</h1>
                    <p className="text-xs text-muted-foreground hidden md:block">Initialize course metadata and settings</p>
                </div>
            </div>
        </div>

        <div className="container max-w-4xl mx-auto p-6 space-y-8 pb-32">
            
            {state.error && (
                <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-3 text-destructive text-sm font-medium border border-destructive/20">
                    <Info className="w-5 h-5 shrink-0" />
                    {state.error}
                </div>
            )}

            <div className="space-y-8">
                <section className="space-y-4">
                    <h2 className="text-xl font-semibold">General Information</h2>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Title <span className="text-red-500">*</span></Label>
                            <Input
                                id="title"
                                name="title"
                                disabled={isPending}
                                placeholder="e.g. Master Next.js 15"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="bg-background"
                            />
                            {state.fieldErrors?.title && (
                                <p className="text-xs text-red-500">{state.fieldErrors.title[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="slug">
                                Course Slug <span className="text-red-500">*</span>
                            </Label>
                            <div className="flex gap-2">
                                <Input
                                    id="slug"
                                    name="slug"
                                    disabled={isPending}
                                    placeholder="e.g. master-nextjs-15"
                                    required
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value)}
                                    className="bg-background"
                                />
                                <Button 
                                    type="button" 
                                    variant="outline" 
                                    onClick={generateSlug}
                                    disabled={!title || isPending}
                                    className="shrink-0"
                                    title="Auto-generate from title"
                                >
                                    <Wand2 className="w-4 h-4" />
                                </Button>
                            </div>
                            {state.fieldErrors?.slug && (
                                <p className="text-xs text-red-500">{state.fieldErrors.slug[0]}</p>
                            )}
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="smallDescription">Short Description</Label>
                            <Textarea 
                                id="smallDescription"
                                name="smallDescription"
                                disabled={isPending}
                                placeholder="Brief summary for course cards..."
                                className="h-24 resize-none bg-background"
                            />
                            <div className="flex justify-between items-center">
                                {state.fieldErrors?.smallDescription ? (
                                    <p className="text-xs text-red-500">{state.fieldErrors.smallDescription[0]}</p>
                                ) : <span></span>}
                                <p className="text-xs text-muted-foreground">Max 255 characters</p>
                            </div>
                        </div>

                        <div className="col-span-2 space-y-2">
                            <Label htmlFor="description">Full Description</Label>
                            <Textarea 
                                id="description"
                                name="description"
                                disabled={isPending}
                                placeholder="Detailed overview of what students will learn..."
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
                                value={thumbnail}
                                onChange={(url) => setThumbnail(url)}
                                onRemove={() => setThumbnail("")}
                                resourceType="image"
                                disabled={isPending}
                            />
                            <input type="hidden" name="thumbnail" value={thumbnail} />
                        </div>
                        {state.fieldErrors?.thumbnail && (
                            <p className="text-xs text-red-500 mt-1">{state.fieldErrors.thumbnail[0]}</p>
                        )}
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
                            <Label htmlFor="categoryId">Category <span className="text-red-500">*</span></Label>
                            <Select name="categoryId" required disabled={isPending}>
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
                            {state.fieldErrors?.categoryId && (
                                <p className="text-xs text-red-500">{state.fieldErrors.categoryId[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="level">Difficulty Level <span className="text-red-500">*</span></Label>
                            <Select name="level" required defaultValue="Beginner" disabled={isPending}>
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
                            <Label htmlFor="status">Status <span className="text-red-500">*</span></Label>
                            <Select name="status" required defaultValue="Draft" disabled={isPending}>
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
                                name="duration"
                                type="number"
                                min="0"
                                disabled={isPending}
                                placeholder="e.g. 120"
                                defaultValue="0"
                                className="bg-background"
                            />
                            {state.fieldErrors?.duration && (
                                <p className="text-xs text-red-500">{state.fieldErrors.duration[0]}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="price">Price (IDR)</Label>
                            <Input
                                id="price"
                                name="price"
                                type="number"
                                min="0"
                                disabled={isPending}
                                placeholder="0 for Free"
                                defaultValue="0"
                                className="bg-background"
                            />
                            {state.fieldErrors?.price && (
                                <p className="text-xs text-red-500">{state.fieldErrors.price[0]}</p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                Set to 0 if this course is free.
                            </p>
                        </div>
                    </div>
                </section>
            </div>

            <div className="fixed bottom-0 left-0 right-0 p-4 border-t bg-background/95 backdrop-blur z-50">
                <div className="container max-w-4xl mx-auto flex justify-end">
                    <Button type="submit" size="lg" className="min-w-50" disabled={isPending || !title || !slug}>
                        {isPending ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating Course...
                            </>
                        ) : (
                            "Create Course"
                        )}
                    </Button>
                </div>
            </div>
        </div>
    </form>
  );
}
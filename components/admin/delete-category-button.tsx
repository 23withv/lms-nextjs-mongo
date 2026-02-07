"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/admin/category";
import { useTransition } from "react";

export function DeleteCategoryButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this category?")) {
      startTransition(async () => {
        await deleteCategory(id);
      });
    }
  };

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={handleDelete} 
      disabled={isPending}
      className="text-muted-foreground hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
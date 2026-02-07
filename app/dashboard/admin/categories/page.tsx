import { connectToDatabase } from "@/lib/mongoose";
import { Category } from "@/models/Category";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CategoryForm } from "@/components/admin/category-form";
import { DeleteCategoryButton } from "@/components/admin/delete-category-button";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { PaginationControl } from "@/components/shared/pagination-control";

interface SearchParamsProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function CategoriesPage(props: SearchParamsProps) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") return redirect("/dashboard");

  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams.page) || 1;
  const limit = 10;
  const skip = (currentPage - 1) * limit;

  await connectToDatabase();
  const [totalItems, categories] = await Promise.all([
    Category.countDocuments({}),
    Category.find({})
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit)
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
          <p className="text-muted-foreground">Manage course categories and topics.</p>
        </div>
        <CategoryForm />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Categories ({totalItems})</CardTitle>
          <CardDescription>
             Showing page {currentPage} of {totalPages || 1}.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12.5">No</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No categories found.
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((category, index) => (
                  <TableRow key={category._id.toString()}>
                    <TableCell className="font-medium text-muted-foreground">
                        {(currentPage - 1) * limit + (index + 1)}
                    </TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                    <TableCell className="text-right">
                      <DeleteCategoryButton id={category._id.toString()} />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="mt-4">
             <PaginationControl totalPages={totalPages} />
          </div>
          
        </CardContent>
      </Card>
    </div>
  );
}
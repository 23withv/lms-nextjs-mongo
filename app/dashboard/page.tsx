import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Trophy, Flame, PlayCircle, ArrowRight, GraduationCap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) return redirect("/login");

  const cookieStore = await cookies();
  const currentMode = cookieStore.get("lms_active_mode")?.value;

  if (currentMode === "INSTRUCTOR" && (session.user.role === "INSTRUCTOR" || session.user.role === "ADMIN")) {
    return redirect("/dashboard/instructor");
  }
  if (currentMode === "ADMIN" && session.user.role === "ADMIN") {
    return redirect("/dashboard/admin/users");
  }

  await connectToDatabase();
  const dbUser = await User.findById(session.user.id);

  if (!dbUser) return redirect("/login");

  const userImage = session.user.image || `https://ui-avatars.com/api/?name=${dbUser.name}&background=random`;
  
  const joinDate = new Date(dbUser.createdAt).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  const formatRole = (role: string) => {
    if (role === "ADMIN") return "Administrator";
    if (role === "INSTRUCTOR") return "Instruktur";
    return "Siswa";
  };

  const isStudent = dbUser.role === "STUDENT";

  return (
    <div className="flex flex-col gap-6 pb-10">
      <div className="flex flex-row justify-between items-center border-b pb-4">
        <div>
           <h2 className="text-2xl font-bold tracking-tight">Halo, {dbUser.name.split(" ")[0]}! 👋</h2>
        </div>
        <Link href="/search">
            <Button size="sm" variant="outline" className="shadow-sm">
                <BookOpen className="mr-2 h-4 w-4" /> Cari Kursus
            </Button>
        </Link>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <StatsCard 
            title="Kursus Aktif" 
            value="0" 
            icon={BookOpen} 
            color="text-blue-500" 
            bg="bg-blue-50"
        />
        <StatsCard 
            title="Sertifikat" 
            value="0" 
            icon={Trophy} 
            color="text-yellow-500" 
            bg="bg-yellow-50"
        />
        <StatsCard 
            title="Jam Belajar" 
            value="0j 0m" 
            icon={Clock} 
            color="text-green-500" 
            bg="bg-green-50"
        />
        <StatsCard 
            title="Streak" 
            value="0 Hari" 
            icon={Flame} 
            color="text-orange-500" 
            bg="bg-orange-50"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="col-span-7 md:col-span-4 lg:col-span-5 shadow-sm">
            <CardHeader className="pb-3">
                <CardTitle className="text-lg">Lanjutkan Belajar</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-lg bg-muted/20">
                    <div className="bg-primary/10 p-3 rounded-full mb-3">
                        <PlayCircle className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                        Belum ada aktivitas belajar terbaru.
                    </p>
                    <Link href="/search">
                        <Button size="sm">
                            Mulai Belajar <ArrowRight className="ml-2 h-3 w-3" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>

        <div className="col-span-7 md:col-span-3 lg:col-span-2 space-y-4">
            <Card className="shadow-sm">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground uppercase tracking-wider font-semibold">Profil Saya</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center text-center space-y-3">
                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-muted shadow-sm">
                        <Image src={userImage} alt="Foto Profil" fill className="object-cover" />
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-base">{dbUser.name}</h3>
                        <p className="text-xs text-muted-foreground">{dbUser.email}</p>
                        <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                            {formatRole(dbUser.role)} • Member since {joinDate.split(" ")[1]}
                        </div>
                    </div>

                    <Link href="/dashboard/settings" className="w-full">
                        <Button variant="outline" className="w-full h-8 text-xs" size="sm">
                          Edit Profile
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {isStudent && (
                <Card className="bg-liner-to-br from-indigo-50 to-purple-50 border-indigo-100 shadow-sm">
                    <CardContent className="p-4 flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-2 rounded-md shadow-sm">
                                <GraduationCap className="h-5 w-5 text-indigo-600" />
                            </div>
                            <div>
                                <h4 className="font-semibold text-sm text-indigo-950">Ingin Mengajar?</h4>
                                <p className="text-xs text-indigo-600/80">Bagikan skill Anda.</p>
                            </div>
                        </div>
                        <Link href="/become-instructor" className="w-full">
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-none" size="sm">
                                Daftar Jadi Guru
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
      </div>
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, bg }: any) {
    return (
        <Card className="shadow-sm border border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
                <div>
                    <p className="text-xs font-medium text-muted-foreground">{title}</p>
                    <p className="text-xl font-bold mt-1">{value}</p>
                </div>
                <div className={`p-2 rounded-md ${bg}`}>
                    <Icon className={`h-4 w-4 ${color}`} />
                </div>
            </CardContent>
        </Card>
    )
}
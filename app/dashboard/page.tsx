import { auth } from "@/auth";
import { connectToDatabase } from "@/lib/mongoose";
import { User } from "@/models/User";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Trophy, Flame, PlayCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Ambil Sesi
  const session = await auth();
  if (!session?.user) return redirect("/login");

  // 2. Ambil Data Real-time dari Database
  await connectToDatabase();
  const dbUser = await User.findById(session.user.id);

  // Fallback jika user tidak ditemukan di DB (Sangat jarang terjadi)
  if (!dbUser) return redirect("/login");

  // 3. Setup Variabel Tampilan
  const userImage = session.user.image || `https://ui-avatars.com/api/?name=${dbUser.name}&background=random`;
  
  // Format Tanggal Bergabung (misal: "Februari 2026")
  const joinDate = new Date(dbUser.createdAt).toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });

  // Format Role agar tidak CAPSLOCK (STUDENT -> Student)
  const formatRole = (role: string) => {
    if (role === "ADMIN") return "Administrator";
    if (role === "TEACHER") return "Instruktur / Guru";
    return "Siswa / Pelajar"; // Default STUDENT
  };

  return (
    <div className="flex flex-col gap-8 pb-10">
      
      {/* --- SECTION 1: HEADER & SAPAAN --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center border-b pb-6">
        <div>
           <h2 className="text-3xl font-bold tracking-tight">Halo, {dbUser.name.split(" ")[0]}! 👋</h2>
           <p className="text-muted-foreground mt-1">Siap untuk meningkatkan skill Anda hari ini?</p>
        </div>
        <Link href="/search">
            <Button className="shadow-sm">
                <BookOpen className="mr-2 h-4 w-4" /> Jelajahi Kursus
            </Button>
        </Link>
      </div>

      {/* --- SECTION 2: STATISTIK --- */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sedang Dipelajari</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Kursus aktif</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Selesai</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Sertifikat diraih</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jam Belajar</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0j 0m</div>
            <p className="text-xs text-muted-foreground">Total waktu fokus</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Streak</CardTitle>
                <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">0 Hari</div>
                <p className="text-xs text-muted-foreground">Konsistensi belajar</p>
            </CardContent>
        </Card>
      </div>

      {/* --- SECTION 3: KONTEN & PROFIL --- */}
      <div className="grid gap-6 md:grid-cols-7">
        
        {/* KOLOM KIRI */}
        <Card className="col-span-7 md:col-span-4 lg:col-span-5 border-none shadow-none bg-transparent md:bg-card md:border md:shadow-sm">
            <CardHeader className="px-0 md:px-6">
                <CardTitle>Lanjutkan Belajar</CardTitle>
                <CardDescription>Teruskan progres kursus terakhir Anda.</CardDescription>
            </CardHeader>
            <CardContent className="px-0 md:px-6">
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-xl bg-muted/30">
                    <div className="bg-background p-4 rounded-full mb-4 shadow-sm">
                        <PlayCircle className="h-8 w-8 text-primary/80" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1">Belum ada aktivitas</h3>
                    <p className="text-sm text-muted-foreground max-w-sm mb-6 leading-relaxed">
                        Sepertinya Anda belum mendaftar di kursus manapun. 
                        Pilih topik yang Anda minati dan mulai belajar hari ini!
                    </p>
                    <Link href="/search">
                        <Button variant="default">
                            Cari Kursus Sekarang <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>

        {/* KOLOM KANAN: PROFIL DINAMIS */}
        <Card className="col-span-7 md:col-span-3 lg:col-span-2 h-fit">
            <CardHeader>
                <CardTitle className="text-base">Profil Saya</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center text-center space-y-4 pt-2">
                <div className="relative h-24 w-24 rounded-full overflow-hidden ring-4 ring-background shadow-lg">
                    <Image 
                        src={userImage} 
                        alt="Foto Profil" 
                        fill 
                        className="object-cover"
                    />
                </div>
                
                <div className="space-y-1">
                    <h3 className="font-bold text-lg">{dbUser.name}</h3>
                    
                    {/* Badge Role Dinamis */}
                    <span className={`text-xs px-2 py-1 rounded-full inline-block font-medium ${
                        dbUser.role === "ADMIN" ? "bg-red-100 text-red-700 border border-red-200" :
                        dbUser.role === "TEACHER" ? "bg-blue-100 text-blue-700 border border-blue-200" :
                        "bg-secondary text-secondary-foreground"
                    }`}>
                        {formatRole(dbUser.role)}
                    </span>
                </div>
                
                <div className="w-full pt-4 space-y-3">
                     <div className="flex justify-between text-sm border-b pb-2">
                        <span className="text-muted-foreground">Email</span>
                        <span className="font-medium max-w-[120px] truncate" title={dbUser.email}>
                            {dbUser.email}
                        </span>
                     </div>
                     <div className="flex justify-between text-sm border-b pb-2">
                        <span className="text-muted-foreground">Bergabung</span>
                        {/* Tanggal Join Dinamis dari DB */}
                        <span className="font-medium">{joinDate}</span>
                     </div>
                </div>

                <Button variant="outline" className="w-full mt-2" size="sm">
                    Edit Profil
                </Button>
            </CardContent>
        </Card>

      </div>
    </div>
  );
}
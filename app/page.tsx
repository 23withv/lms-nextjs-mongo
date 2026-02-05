import { auth, signOut } from "@/auth"; 
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { BookOpen, Users, Trophy, CheckCircle, ArrowRight, Star, MonitorPlay } from "lucide-react";

export default async function Home() {
  const session = await auth();

  // Data Dummy untuk Preview Kursus
  const featuredCourses = [
    {
      title: "Fullstack Web Development",
      category: "Programming",
      students: "1,204",
      rating: 4.8,
      image: "bg-blue-100", // Ganti dengan Image asli nanti
      color: "text-blue-600"
    },
    {
      title: "Digital Marketing Mastery",
      category: "Marketing",
      students: "850",
      rating: 4.7,
      image: "bg-purple-100",
      color: "text-purple-600"
    },
    {
      title: "Data Science with Python",
      category: "Data Science",
      students: "2,300",
      rating: 4.9,
      image: "bg-green-100",
      color: "text-green-600"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
            <MonitorPlay className="h-6 w-6" />
            LMS Platform
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            {session ? (
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="hidden md:flex">Dashboard</Button>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/login" });
                  }}
                >
                  <Button variant="destructive" size="sm">
                    Log out
                  </Button>
                </form>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button>Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        
        {/* --- HERO SECTION --- */}
        <section className="relative py-20 md:py-32 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm rounded-full">
              🚀 The Future of Learning is Here
            </Badge>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Master New Skills with <br />
              <span className="text-transparent bg-clip-text bg-linier-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Expert-Led Online Courses
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Access thousands of high-quality lessons, interactive quizzes, and professional certifications to accelerate your career growth.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {session ? (
                 <Link href="/dashboard">
                   <Button size="lg" className="px-8 h-12 text-base rounded-full shadow-lg shadow-primary/20">
                     Continue Learning <ArrowRight className="ml-2 h-4 w-4" />
                   </Button>
                 </Link>
              ) : (
                 <Link href="/register">
                   <Button size="lg" className="px-8 h-12 text-base rounded-full shadow-lg shadow-primary/20">
                     Start Learning for Free
                   </Button>
                 </Link>
              )}
              <Link href="/search">
                <Button variant="outline" size="lg" className="px-8 h-12 text-base rounded-full">
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>

          {/* Background Decoration */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl -z-10 opacity-10 dark:opacity-5">
             <div className="absolute top-10 left-10 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
             <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* --- STATS SECTION --- */}
        <section className="border-y bg-muted/30 py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">10k+</h3>
                <p className="text-muted-foreground text-sm font-medium">Active Students</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">500+</h3>
                <p className="text-muted-foreground text-sm font-medium">Expert Instructors</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">1.2k+</h3>
                <p className="text-muted-foreground text-sm font-medium">Courses Published</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-bold text-primary">4.9/5</h3>
                <p className="text-muted-foreground text-sm font-medium">Average Rating</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- FEATURES SECTION --- */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Why Choose LMS Platform?</h2>
              <p className="text-muted-foreground">
                We provide the best learning experience tailored to your needs, helping you achieve your goals faster.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="border-none shadow-md bg-muted/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 text-blue-600 dark:text-blue-300">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <CardTitle>Diverse Course Library</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    From coding to business, explore a wide range of topics taught by industry experts.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-muted/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 text-green-600 dark:text-green-300">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <CardTitle>Earn Certificates</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get recognized certifications upon completion to showcase your skills to employers.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md bg-muted/20">
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 text-purple-600 dark:text-purple-300">
                    <Users className="h-6 w-6" />
                  </div>
                  <CardTitle>Community Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Join a community of learners, ask questions, and collaborate on projects together.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* --- POPULAR COURSES PREVIEW --- */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <h2 className="text-3xl font-bold tracking-tight mb-2">Popular Courses</h2>
                <p className="text-muted-foreground">Explore our highest-rated courses.</p>
              </div>
              <Link href="/search" className="hidden md:block">
                <Button variant="ghost" className="gap-2">View All <ArrowRight className="h-4 w-4"/></Button>
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredCourses.map((course, index) => (
                <Card key={index} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className={`h-40 w-full ${course.image} flex items-center justify-center`}>
                    <BookOpen className={`h-12 w-12 ${course.color} opacity-50`} />
                  </div>
                  <CardContent className="pt-6">
                    <Badge variant="secondary" className="mb-2">{course.category}</Badge>
                    <h3 className="font-bold text-lg mb-2 line-clamp-1">{course.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" /> {course.students}
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {course.rating}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t pt-4">
                    <Button className="w-full" variant="secondary">Preview Course</Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link href="/search">
                 <Button variant="outline" className="w-full">View All Courses</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* --- CTA SECTION --- */}
        <section className="py-20">
           <div className="container mx-auto px-4">
             <div className="bg-primary rounded-3xl p-8 md:p-16 text-center text-primary-foreground relative overflow-hidden">
               <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                 <h2 className="text-3xl md:text-5xl font-bold">Ready to Start Learning?</h2>
                 <p className="text-primary-foreground/80 text-lg">
                   Join thousands of students and start your journey towards success today.
                 </p>
                 <Link href="/register">
                   <Button size="lg" variant="secondary" className="px-8 h-12 rounded-full font-bold">
                     Join for Free Now
                   </Button>
                 </Link>
               </div>
               
               {/* Decorative Circles */}
               <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
               <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2"></div>
             </div>
           </div>
        </section>

      </main>

      {/* --- FOOTER --- */}
      <footer className="py-10 bg-background border-t">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 font-bold text-xl mb-4">
                <MonitorPlay className="h-6 w-6" /> LMS Platform
              </div>
              <p className="text-muted-foreground max-w-sm">
                Empowering learners worldwide with accessible, high-quality education. Learn anywhere, anytime.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/search" className="hover:text-primary">Browse Courses</Link></li>
                <li><Link href="/become-instructor" className="hover:text-primary">Become Instructor</Link></li>
                <li><Link href="/pricing" className="hover:text-primary">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-primary">Contact Us</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LMS Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
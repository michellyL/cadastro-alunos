import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, UserCheck, UserX, LogOut, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Stats {
  total: number;
  active: number;
  inactive: number;
  graduated: number;
}

const Dashboard = () => {
  const { profile, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats>({ total: 0, active: 0, inactive: 0, graduated: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("status");

      if (error) throw error;

      const statsData = data?.reduce(
        (acc, student) => {
          acc.total++;
          if (student.status === "active") acc.active++;
          if (student.status === "inactive") acc.inactive++;
          if (student.status === "graduated") acc.graduated++;
          return acc;
        },
        { total: 0, active: 0, inactive: 0, graduated: 0 }
      ) || { total: 0, active: 0, inactive: 0, graduated: 0 };

      setStats(statsData);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast.error("Erro ao carregar estatísticas");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast.success("Logout realizado com sucesso!");
  };

  const canManageStudents = userRole?.role === "admin" || userRole?.role === "gestor" || userRole?.role === "secretaria";

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="bg-card border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-primary p-2">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Sistema de Gestão Escolar</h1>
                <p className="text-sm text-muted-foreground">
                  {profile?.first_name} {profile?.last_name} • {userRole?.role}
                </p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Visão geral do sistema</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Alunos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold">{stats.total}</div>
                <Users className="h-8 w-8 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-success">{stats.active}</div>
                <UserCheck className="h-8 w-8 text-success opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Inativos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-destructive">{stats.inactive}</div>
                <UserX className="h-8 w-8 text-destructive opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Formados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-accent">{stats.graduated}</div>
                <GraduationCap className="h-8 w-8 text-accent opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>Navegue pelas principais funcionalidades</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            <Button
              size="lg"
              className="h-20"
              onClick={() => navigate("/students")}
            >
              <Users className="h-6 w-6 mr-3" />
              <div className="text-left">
                <div className="font-semibold">Ver Alunos</div>
                <div className="text-xs opacity-90">Lista completa de alunos</div>
              </div>
            </Button>

            {canManageStudents && (
              <Button
                size="lg"
                variant="secondary"
                className="h-20"
                onClick={() => navigate("/students/new")}
              >
                <UserPlus className="h-6 w-6 mr-3" />
                <div className="text-left">
                  <div className="font-semibold">Adicionar Aluno</div>
                  <div className="text-xs opacity-90">Cadastrar novo aluno</div>
                </div>
              </Button>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;

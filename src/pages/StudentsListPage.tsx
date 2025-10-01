import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface Student {
  student_id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  grade_level: string | null;
  status: string;
  enrollment_date: string;
}

const StudentsListPage = () => {
  const { userRole } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from("students")
        .select("*")
        .order("last_name");

      if (error) throw error;
      setStudents(data || []);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Erro ao carregar alunos");
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(s =>
    `${s.first_name} ${s.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  const canEdit = userRole?.role === "admin" || userRole?.role === "gestor" || userRole?.role === "secretaria";

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Alunos</h1>
          <div className="flex gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar alunos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            {canEdit && (
              <Button onClick={() => navigate("/students/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Aluno
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          {filteredStudents.map((student) => (
            <Card key={student.student_id} className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{student.first_name} {student.last_name}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      {student.email && <span>{student.email}</span>}
                      {student.grade_level && <span>Série: {student.grade_level}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={student.status === "active" ? "default" : "secondary"}>
                      {student.status}
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${student.student_id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    {canEdit && (
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/students/${student.student_id}/edit`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentsListPage;
